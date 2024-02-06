const apiUrl = process.env.API_URL || "http://localhost:8080/api";

export async function createItem(item) {
  try {
    return await fetch(`${apiUrl}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
  } catch (err) {
    return console.log(err);
  }
}

export async function fetcher(path) {
  return fetch(`${apiUrl}/${path}`).then((res) => res.json());
}
