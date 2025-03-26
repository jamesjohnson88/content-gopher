package middleware

import (
	"bytes"
	"io"
	"log/slog"
	"net/http"
	"time"
)

// LoggingMiddleware logs all incoming requests and outgoing responses
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// log incoming request
		reqBody, _ := io.ReadAll(r.Body)                // read/copy body
		r.Body = io.NopCloser(bytes.NewBuffer(reqBody)) // then add it back

		// log request
		var rqHeaderAttrs []any
		for k, v := range r.Header {
			rqHeaderAttrs = append(rqHeaderAttrs, slog.Any(k, v))
		}

		slog.Info("incoming_request",
			slog.String("method", r.Method),
			slog.String("url", r.URL.String()),
			slog.String("ip", r.RemoteAddr),
			slog.Group("headers", rqHeaderAttrs...),
			slog.String("body", string(reqBody)),
		)

		// capture response
		rs := &loggingResponseWriter{ResponseWriter: w, body: &bytes.Buffer{}}
		next.ServeHTTP(rs, r)

		// log response
		var rsHeaderAttrs []any
		for k, v := range rs.Header() {
			rsHeaderAttrs = append(rsHeaderAttrs, slog.Any(k, v))
		}

		slog.Info("outgoing_response",
			slog.Int("status_code", rs.statusCode),
			slog.Duration("duration", time.Since(start)),
			slog.Group("headers", rsHeaderAttrs...),
			slog.String("body", rs.body.String()),
		)
	})
}

// loggingResponseWriter captures response body and status code
type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
	body       *bytes.Buffer
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

func (lrw *loggingResponseWriter) Write(p []byte) (int, error) {
	lrw.body.Write(p) // capture response body
	return lrw.ResponseWriter.Write(p)
}
