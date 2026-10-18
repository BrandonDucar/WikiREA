# Operational And Creative-State Glossary

| Term | Meaning In The Inspected Sources | Boundary |
| --- | --- | --- |
| Time system | Declares how numerical time values should be interpreted | Registration is not a unit conversion |
| Clock | Supplies values driving a real-time view | Not the same as the event's observation time |
| Fixed bounds | A chosen time range used to view history | Moving the range does not change recorded history |
| Independent time context | A view-specific temporal configuration | Must not silently turn a historical panel live |
| Historical provider | Can answer a request for retained telemetry | Does not imply live subscription capability |
| Subscription provider | Can deliver updates over time | Does not alone prove completeness or freshness |
| Undo history | Retained previous edit states | Not a durable server queue |
| Snapshot | Named retained document content and edit-target state | In the inspected PhotoCraft code, session-scoped |
| Object identity | The identifier other views/caches use to refer to an object | Should not be replaced accidentally during restore |
| Copy-on-write | Sharing backing state until a modification needs a distinct copy | Actual memory accounting still needs tests |
| Active target | The layer/object an operation acts on | Restoring content without restoring target can change the next action |
| Background-job guard | Prevents state movement while an in-flight job depends on it | This selected guard is not proof every concurrent path is safe |

Sources: [Open MCT investigation](nasa-openmct.md), [PhotoCraft investigation](photocraft-history.md).
Navigation: [library home](index.md), [finance terms](finance-glossary.md),
[simulation terms](quantum-glossary.md).
