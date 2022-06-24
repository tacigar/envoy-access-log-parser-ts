// [%START_TIME%] "%REQ(:METHOD)% %REQ(X-ENVOY-ORIGINAL-PATH?:PATH)% %PROTOCOL%"
// %RESPONSE_CODE% %RESPONSE_FLAGS% %BYTES_RECEIVED% %BYTES_SENT% %DURATION%
// %RESP(X-ENVOY-UPSTREAM-SERVICE-TIME)% "%REQ(X-FORWARDED-FOR)%" "%REQ(USER-AGENT)%"
// "%REQ(X-REQUEST-ID)%" "%REQ(:AUTHORITY)%" "%UPSTREAM_HOST%"\n
//
// [%000] "%001 %002 %003" %004 %005 %006 %007 %008 %009 "%010" "%011" "%012" "%013" "%014"
//
// {
//    0: 'START_TIME',
//    1: 'REQ(:METHOD)',
//    2: 'REQ(X-ENVOY-ORIGINAL-PATH?:PATH)',
//    3: 'PROTOCOL',
//    4: 'RESPONSE_CODE',
//    5: 'RESPONSE_FLAGS',
//    6: 'BYTES_RECEIVED',
//    7: 'BYTES_SENT',
//    8: 'DURATION',
//    9: 'RESP(X-ENVOY-UPSTREAM-SERVICE-TIME)',
//   10: 'REQ(X-FORWARDED-FOR)',
//   11: 'REQ(USER-AGENT)',
//   12: 'REQ(X-REQUEST-ID)',
//   13: 'REQ(:AUTHORITY)',
//   14: 'UPSTREAM_HOST'
// }
export const parseFormat = (format: string) => {
  let result = "";
  let buffer = "";

  let varIdx = 0;
  let isPercentOpen = false;
  const varIdxToStr: { [n: number]: string } = {};

  for (let i = 0; i < format.length; i++) {
    const c = format.charAt(i);
    switch (c) {
      case "%":
        if (isPercentOpen) {
          isPercentOpen = false;
          result += "(.*)";
          varIdxToStr[varIdx] = buffer;
          varIdx++;
          buffer = "";
        } else {
          isPercentOpen = true;
        }
        break;
      default:
        if (isPercentOpen) {
          buffer += c;
        } else {
          result += c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        break;
    }
  }
  return { result, varIdxToStr };
};
