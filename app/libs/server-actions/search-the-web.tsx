interface Request {
  query: string;
  country?: countryOptions;
  freshness?: freshnessOptions;
  units?: "metric" | "imperial";
  count?: number;
}

type countryOptions =
  | "AR"
  | "AU"
  | "AT"
  | "BE"
  | "BR"
  | "CA"
  | "CL"
  | "DK"
  | "FI"
  | "FR"
  | "DE"
  | "HK"
  | "IN"
  | "ID"
  | "IT"
  | "JP"
  | "KR"
  | "MY"
  | "MX"
  | "NL"
  | "NZ"
  | "NO"
  | "CN"
  | "PL"
  | "PT"
  | "PH"
  | "RU"
  | "SA"
  | "ZA"
  | "ES"
  | "SE"
  | "CH"
  | "TW"
  | "TH"
  | "TR"
  | "GB"
  | "US";

type freshnessOptions =
  | "past-day"
  | "pd"
  | "past-week"
  | "pw"
  | "past-month"
  | "pm"
  | "past-year"
  | "py";

export default async function search_the_web({
  query,
  country,
  freshness,
  units,
  count = 5,
}: Request) {
  "use server";
  console.log("Request received for search_the_web action");

  if (freshness) {
    if (freshness === "past-day") {
      freshness = "pd";
    } else if (freshness === "past-week") {
      freshness = "pw";
    } else if (freshness === "past-month") {
      freshness = "pm";
    } else if (freshness === "past-year") {
      freshness = "py";
    }
  }

  try {
    const url = new URL(
      `https://api.search.brave.com/res/v1/web/search?q=${query}&text_decorations=0&count=${count}`
    );
    // add optional parameters
    if (country) {
      url.searchParams.append("country", country);
    }
    if (freshness) {
      url.searchParams.append("freshness", freshness);
    }
    if (units) {
      url.searchParams.append("units", units);
    }

    const headers = {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY || "",
    };

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let results = data.web.results;

    results = results.map((result: any) => ({
      title: result.title,
      url: result.url,
      description: result.description,
      date: result.page_age,
      author: result.profile?.name,
      imageURL: result.thumbnail?.src,
    }));

    return results;
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}