FROM golang:1.19 as builder

WORKDIR /app

RUN go mod init hello

COPY main.go /app

RUN go build

FROM scratch

COPY --from=builder /app/hello /

CMD [ "/hello" ]