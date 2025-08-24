/* eslint-disable @typescript-eslint/no-explicit-any */
export const get = async (url: string, config?: RequestInit) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      ...config,
    });
    const result = await response.json();
    if (!result.success) {
      throw result.error || new Error("Request failed");
    }
    return result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const post = async (
  url: string,
  options?: Record<string, any>,
  config?: RequestInit
) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(options),
      ...config,
    });

    if (!response.ok && response.status === 500) {
      throw new Error("Internal Server Error");
    }

    const result = await response.json();

    if (!result.success) {
      throw result.error || new Error("Request failed");
    }

    return result.data;
  } catch (error: any) {
    console.log(error);
    throw error.message || error;
  }
};

export const patch = async (
  url: string,
  options?: Record<string, any>,
  config?: RequestInit
) => {
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(options),
      ...config,
    });

    if (!response.ok && response.status === 500) {
      throw new Error("Internal Server Error");
    }

    const result = await response.json();

    if (!result.success) {
      throw result.error || new Error("Request failed");
    }

    return result.data;
  } catch (error: any) {
    console.log(error);
    throw error.message || error;
  }
};

export const postStreamWithReader = async (
  url: string,
  options?: Record<string, any>
) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const reader = response.body?.getReader();
    return reader;
  } catch (error) {
    throw error;
  }
};
