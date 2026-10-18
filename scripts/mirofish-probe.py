"""Original opt-in probe of two separately retrieved, unmodified upstream modules."""
import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import tempfile

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'provenance/mirofish-pipeline.json').read_text(encoding='utf-8'))
source = root / '.local' / ('mirofish-pipeline-' + manifest['commit']) / 'source'
selected = ['backend/app/utils/file_parser.py', 'backend/scripts/action_logger.py']


def verify():
    for name in selected:
        record = next(f for f in manifest['files'] if f['name'] == name)
        content = (source / name).read_bytes()
        assert len(content) == record['sizeBytes']
        assert hashlib.sha256(content).hexdigest() == record['sha256']
        assert hashlib.sha1(('blob %d\0' % len(content)).encode() + content).hexdigest() == record['gitBlobSha1']


def audit(event, args):
    if event.startswith(('socket.', 'subprocess.', 'ctypes.')) or event in ('os.system', 'os.exec', 'os.posix_spawn'):
        raise PermissionError('PUBLIC_PROBE_EXTERNAL_EFFECT_DENIED')


def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, source / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


verify()
sys.addaudithook(audit)
parser = load('wikirea_parser_probe', selected[0])
logger_module = load('wikirea_logger_probe', selected[1])
with tempfile.TemporaryDirectory(prefix='mirofish-public-probe-') as folder:
    job = Path(folder)
    text = '\n'.join('Original fixture line %d. Paper evidence is not a prediction.' % i for i in range(12))
    seed = job / 'seed.txt'
    seed.write_text(text, encoding='utf-8', newline='\n')
    parsed = parser.FileParser.extract_text(str(seed))
    assert parsed == text
    chunks = parser.split_text_into_chunks(parsed, 256, 32)
    assert len(chunks) > 1 and all(c in text and len(c) <= 256 for c in chunks)
    log = logger_module.PlatformActionLogger('fixture', folder)
    log.log_round_start(1, 0)
    log.log_action(1, 0, 'fixture-only', 'FIXTURE_CHECK', result='accepted', success=True)
    log.log_action(1, 1, 'fixture-only', 'FIXTURE_CHECK', result='rejected', success=False)
    log.log_round_end(1, 2)
    rows = [json.loads(s) for s in Path(log.log_path).read_text(encoding='utf-8').splitlines()]
    assert len(rows) == 4 and rows[1]['success'] is True and rows[2]['success'] is False
    assert rows[-1]['actions_count'] == 2
    verify()
    print(json.dumps({'status': 'PASS_COMPONENT_PROBE', 'commit': manifest['commit'],
                      'executedSourceFiles': selected, 'seedChunks': len(chunks), 'traceRows': len(rows),
                      'fixtureOnly': True, 'simulationExecuted': False, 'modelCalls': 0,
                      'authorityGranted': False}))
