/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`src/app.test.ts TAP E2E GET \`/\` route > must match snapshot 1`] = `
Array [
  Object {
    "authType": "oauth",
    "description": "Reddit is an American social news aggregation, web content rating, and discussion website.",
    "filters": Array [
      Object {
        "description": "Custom feeds",
        "id": "multireddit",
        "name": "Multireddits",
        "supportsMultiple": false,
        "supportsSearch": true,
      },
      Object {
        "description": "My communities",
        "id": "subreddit",
        "name": "Subreddits",
        "supportsMultiple": true,
        "supportsSearch": true,
      },
      Object {
        "description": "See other posts submitted by this user",
        "id": "user",
        "name": "Submitted By",
        "supportsMultiple": false,
        "supportsSearch": false,
      },
    ],
    "icon": "http://localhost:56309/reddit_icon.png",
    "id": "reddit",
    "name": "Reddit",
    "oAuthUrl": "https://www.reddit.com/api/v1/authorize.compact?client_id=&redirect_uri=http%3A%2F%2Flocalhost&response_type=code&state=MI6J23JlB_yuSIIx3m94C&duration=permanent&scope=read+mysubreddits+history",
    "sort": Array [
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "hot",
        "isDefault": true,
        "name": "Hot",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "best",
        "isDefault": false,
        "name": "Best",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top",
        "isDefault": false,
        "name": "Top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "new",
        "isDefault": false,
        "name": "New",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "rising",
        "isDefault": false,
        "name": "Rising",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "controversial",
        "isDefault": false,
        "name": "Controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance",
        "isDefault": true,
        "name": "Relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments",
        "isDefault": true,
        "name": "Total Comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "comments",
      },
    ],
    "supportsAuthorFilter": true,
    "supportsItemFilters": true,
    "supportsSourceFilter": true,
  },
  Object {
    "authType": "oauth",
    "description": "Pixiv is a Japanese online community for artists.",
    "filters": Array [
      Object {
        "description": "Filter by tagged content",
        "id": "tag",
        "name": "Tags",
        "supportsMultiple": true,
        "supportsSearch": true,
      },
      Object {
        "description": "Added by user",
        "id": "user",
        "name": "User",
        "supportsMultiple": true,
        "supportsSearch": true,
      },
    ],
    "icon": "http://localhost:56309/pixiv_icon.png",
    "id": "pixiv",
    "name": "Pixiv",
    "oAuthUrl": "https://app-api.pixiv.net/web/v1/login?code_challenge_method=S256&code_challenge=vB02TPVwybApgGemXGTPWlcZGur_F-b7IzKIisIsFzk&client=pixiv-ios",
    "sort": Array [
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "following",
        "isDefault": true,
        "name": "Following",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "recommended",
        "isDefault": false,
        "name": "Recommended ",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "recommended-illust",
        "isDefault": false,
        "name": "Illustrations",
        "parentId": "recommended",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "recommended-manga",
        "isDefault": false,
        "name": "Manga",
        "parentId": "recommended",
      },
    ],
    "supportsAuthorFilter": false,
    "supportsItemFilters": false,
    "supportsSourceFilter": false,
  },
]
`

exports[`src/app.test.ts TAP GET \`/\` route > must match snapshot 1`] = `
Array [
  Object {
    "authType": "oauth",
    "description": "Reddit is an American social news aggregation, web content rating, and discussion website.",
    "filters": Array [
      Object {
        "description": "Custom feeds",
        "id": "multireddit",
        "name": "Multireddits",
        "supportsMultiple": false,
        "supportsSearch": true,
      },
      Object {
        "description": "My communities",
        "id": "subreddit",
        "name": "Subreddits",
        "supportsMultiple": true,
        "supportsSearch": true,
      },
      Object {
        "description": "See other posts submitted by this user",
        "id": "user",
        "name": "Submitted By",
        "supportsMultiple": false,
        "supportsSearch": false,
      },
    ],
    "icon": "http://localhost:80/reddit_icon.png",
    "id": "reddit",
    "name": "Reddit",
    "oAuthUrl": "https://www.reddit.com/api/v1/authorize.compact?client_id=&redirect_uri=http%3A%2F%2Flocalhost&response_type=code&state=MI6J23JlB_yuSIIx3m94C&duration=permanent&scope=read+mysubreddits+history",
    "sort": Array [
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "hot",
        "isDefault": true,
        "name": "Hot",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "best",
        "isDefault": false,
        "name": "Best",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top",
        "isDefault": false,
        "name": "Top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "top-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "top",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "new",
        "isDefault": false,
        "name": "New",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "new-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "new",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "rising",
        "isDefault": false,
        "name": "Rising",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": false,
        "id": "controversial",
        "isDefault": false,
        "name": "Controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "controversial-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "controversial",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance",
        "isDefault": true,
        "name": "Relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "relevance-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "relevance",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments",
        "isDefault": true,
        "name": "Total Comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-hour",
        "isDefault": false,
        "name": "Hour",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-day",
        "isDefault": false,
        "name": "Day",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-week",
        "isDefault": false,
        "name": "Week",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-month",
        "isDefault": false,
        "name": "Month",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-year",
        "isDefault": false,
        "name": "Year",
        "parentId": "comments",
      },
      Object {
        "availableInSearch": true,
        "exclusiveToSearch": true,
        "id": "comments-all",
        "isDefault": false,
        "name": "All Time",
        "parentId": "comments",
      },
    ],
    "supportsAuthorFilter": true,
    "supportsItemFilters": true,
    "supportsSourceFilter": true,
  },
  Object {
    "authType": "oauth",
    "description": "Pixiv is a Japanese online community for artists.",
    "filters": Array [
      Object {
        "description": "Filter by tagged content",
        "id": "tag",
        "name": "Tags",
        "supportsMultiple": true,
        "supportsSearch": true,
      },
      Object {
        "description": "Added by user",
        "id": "user",
        "name": "User",
        "supportsMultiple": true,
        "supportsSearch": true,
      },
    ],
    "icon": "http://localhost:80/pixiv_icon.png",
    "id": "pixiv",
    "name": "Pixiv",
    "oAuthUrl": "https://app-api.pixiv.net/web/v1/login?code_challenge_method=S256&code_challenge=vB02TPVwybApgGemXGTPWlcZGur_F-b7IzKIisIsFzk&client=pixiv-ios",
    "sort": Array [
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "following",
        "isDefault": true,
        "name": "Following",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "recommended",
        "isDefault": false,
        "name": "Recommended ",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "recommended-illust",
        "isDefault": false,
        "name": "Illustrations",
        "parentId": "recommended",
      },
      Object {
        "availableInSearch": false,
        "exclusiveToSearch": false,
        "id": "recommended-manga",
        "isDefault": false,
        "name": "Manga",
        "parentId": "recommended",
      },
    ],
    "supportsAuthorFilter": false,
    "supportsItemFilters": false,
    "supportsSourceFilter": false,
  },
]
`
