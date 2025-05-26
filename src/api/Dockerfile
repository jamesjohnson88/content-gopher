FROM golang:1.24.1 AS build

WORKDIR /workspace

COPY go.mod go.sum ./
RUN go mod download

COPY . ./
RUN CGO_ENABLED=0 go build -o /go/bin/app

FROM gcr.io/distroless/static-debian12
COPY --from=build /go/bin/app /

CMD ["/app"] 