FROM node:20 AS web-build
ARG API_URL=http://localhost:8080/api
WORKDIR /build
COPY web/package.json .
RUN npm install
COPY web/ .
ENV API_URL=$API_URL
RUN npm run build

FROM golang:1.21 AS server-build
WORKDIR /build
COPY go.mod .
 COPY go.sum .
RUN go mod download
COPY cmd/ ./cmd/
COPY --from=web-build /build/dist ./cmd/server/dist
RUN CGO_ENABLED=0 go build -o /server ./cmd/server

FROM gcr.io/distroless/static
USER nonroot:nonroot
COPY --from=server-build --chown=nonroot:nonroot /server /server
ENTRYPOINT ["/server"]
