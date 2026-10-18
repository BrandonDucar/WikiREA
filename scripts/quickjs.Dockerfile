FROM node@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f AS build
RUN apk add --no-cache build-base
ADD quickjs.tar.gz /build/
RUN make -C /build/quickjs-84e723f1ace5e3823cef8149dd0f890fe74b77ce -j2 qjs
FROM node@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f
COPY --from=build /build/quickjs-84e723f1ace5e3823cef8149dd0f890fe74b77ce/qjs /usr/local/bin/qjs
USER node
ENTRYPOINT ["qjs"]
