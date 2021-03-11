export default async function delay(duration: number = 100) {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  });
}
