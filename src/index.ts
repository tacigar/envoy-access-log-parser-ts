import { parseFormat } from "./format";

/*
type Request = {
  // METHOD header
  method: string;
  // X-ENVOY-ORIGINAL-PATH or PATH header
  path: string;
  // USER-AGENT header
  userAgent: string;
  // AUTHORITY header
  authority: string;
  // X-FORWARDED-FOR header
  xForwardedFor: string;
  // X-REQUEST-ID header
  xRequestId: string;
};

type Response = {
  // X-ENVOY-UPSTREAM-SERVICE-TIME header
  xEnvoyUpstreamServiceTime: string;
};

export type LogRecord = {
  startTime: string;
  protocol: string;
  responseCode: string;
  responseFlags: string;
  bytesReceived: string;
  bytesSent: string;
  duration: string;
  upstreamHost: string;
  request: Request;
  response: Response;
};

export class InvalidFormatError extends Error {
  constructor() {
    super("Invalid log format");
  }
}

// This does not support escaped double quote (\")
// since envoy does not seem to support it..
// See: https://github.com/envoyproxy/envoy/issues/4191
const splitAccessLog = (accessLog: string) => {
  const segments: string[] = [];
  let isDoubleQuoteOpen = false;
  let buffer = "";
  for (let i = 0; i < accessLog.length; i++) {
    const c = accessLog.charAt(i);
    switch (c) {
      case '"':
        if (isDoubleQuoteOpen) {
          isDoubleQuoteOpen = false;
          segments.push(buffer);
          buffer = "";
        } else {
          isDoubleQuoteOpen = true;
        }
        break;
      case " ":
        if (isDoubleQuoteOpen) {
          buffer += c;
        } else if (buffer != "") {
          segments.push(buffer);
          buffer = "";
        }
        break;
      default:
        buffer += c;
        break;
    }
  }
  return segments;
};

const parseStartTime = (segment: string) => {
  if (segment.length <= 2) {
    throw new InvalidFormatError();
  }
  if (segment.charAt(0) !== "[" || segment.charAt(segment.length - 1) !== "]") {
    throw new InvalidFormatError();
  }
  return segment.substring(1, segment.length - 1);
};

export const parseAccessLog = (accessLog: string): LogRecord => {
  const segments = splitAccessLog(accessLog);
  if (segments.length !== 13) {
    throw new InvalidFormatError();
  }
  // Extract %START_TIME%
  const startTime = parseStartTime(segments[0]);
  // Extract %REQ(:METHOD)%, %REQ(X-ENVOY-ORIGIANL-PATH?:PATH)%, and %PROTOCOL%
  const reqSegments = segments[1].split(" ");
  if (reqSegments.length !== 3) {
    throw new InvalidFormatError();
  }
  return {
    startTime,
    protocol: reqSegments[2],
    responseCode: segments[2],
    responseFlags: segments[3],
    bytesReceived: segments[4],
    bytesSent: segments[5],
    duration: segments[6],
    upstreamHost: segments[12],
    request: {
      method: reqSegments[0],
      path: reqSegments[1],
      xForwardedFor: segments[8],
      userAgent: segments[9],
      xRequestId: segments[10],
      authority: segments[11],
    },
    response: {
      xEnvoyUpstreamServiceTime: segments[7],
    },
  };
};
*/

const log =
  '[2016-04-15T20:17:00.310Z] "POST /api/v1/locations HTTP/2" 204 - 154 0 226 100 "10.0.35.28" "nsq2http" "cc21d9b0-cf5c-432b-8c7e-98aeb7988cd2" "locations" "tcp://10.0.2.1:80"';

const { result, varIdxToStr } = parseFormat(
  '[%START_TIME%] "%REQ(:METHOD)% %REQ(X-ENVOY-ORIGINAL-PATH?:PATH)% %PROTOCOL%" %RESPONSE_CODE% %RESPONSE_FLAGS% %BYTES_RECEIVED% %BYTES_SENT% %DURATION% %RESP(X-ENVOY-UPSTREAM-SERVICE-TIME)% "%REQ(X-FORWARDED-FOR)%" "%REQ(USER-AGENT)%" "%REQ(X-REQUEST-ID)%" "%REQ(:AUTHORITY)%" "%UPSTREAM_HOST%"'
);

const match = log.match(result);

if (!match || match.length === 0) {
  console.log("error");
} else {
  const ret: { [key: string]: string } = {};
  for (let i = 1; i < match.length; i++) {
    ret[varIdxToStr[i - 1]] = match[i];
  }
  console.log(ret);
}
