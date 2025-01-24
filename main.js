import dotenv from "dotenv";
dotenv.config(); // .env 파일에서 환경 변수 로드
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// TODO(developer): propertyId 변수를 GA4 속성 ID로 변경
const propertyId = "421324445"; // 실제 GA4 속성 ID로 변경

// GOOGLE_APPLICATION_CREDENTIALS 환경 변수를 통해 인증 정보를 자동으로 찾습니다.
const analyticsDataClient = new BetaAnalyticsDataClient();

async function runReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    metrics: [{ name: "screenPageViews" }],
    dimensions: [
      { name: "pagePath" },
      { name: "pageTitle" },
      { name: "fullPageUrl" },
    ],

    orderBys: [
      {
        metric: { metricName: "screenPageViews" },
        desc: true,
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "PARTIAL_REGEXP",
          value: "\\/\\d+",
          caseSensitive: false,
        },
      },
    },
    limit: 5,
  });

  response.rows.forEach((row) => {
    console.log(
      row.dimensionValues[0].value,
      row.dimensionValues[1].value,
      row.dimensionValues[2].value,
      row.metricValues[0].value
    );
  });
}
runReport();
