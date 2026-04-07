export function fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      const delay = 1000;
  
      setTimeout(() => {
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: "OK",
          url,
          json: async () => ({ message: "This is a mock response", url }),
          text: async () => "This is a mock response",
        };
  
        // Use the URL to simulate failure or success
        if (url.includes("error")) {
          reject(new Error("Network error"));
        } else {
          resolve(mockResponse);
        }
      }, delay);
    });
  }
  