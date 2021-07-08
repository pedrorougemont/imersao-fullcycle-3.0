FROM golang:1.15

WORKDIR /go/src
ENV PATH="/go/bin:${PATH}"
ENV GO111MODULE=on
ENV GODEBUG=netdns=1
ENV CGO_ENABLED=1

RUN apt-get update && \
    apt-get install build-essential protobuf-compiler librdkafka-dev -y
RUN go get google.golang.org/grpc/cmd/protoc-gen-go-grpc && \
    go get github.com/golang/protobuf/protoc-gen-go
RUN wget https://github.com/ktr0731/evans/releases/download/0.9.1/evans_linux_amd64.tar.gz && \ 
    tar -zxvf evans_linux_amd64.tar.gz && \
    mv evans ../bin && rm -f evans_linux_amd64.tar.gz
RUN go get golang.org/x/tools/gopls@master golang.org/x/tools@master

CMD ["tail", "-f", "/dev/null"]
