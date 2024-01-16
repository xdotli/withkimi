export function generateParamURL<T>(baseURL: string, params: T): string {
  let generatedURL = baseURL + "?";
  for (const key in params) {
    generatedURL += key + "=" + params[key];
  }

  return generatedURL;
}

export function formattedTime(seconds: number) {
  const minute = Math.floor(seconds / 60);
  const second = seconds - minute * 60;
  const ret = minute + ":" + (second < 10 ? "0" : "") + second;

  return ret;
}
