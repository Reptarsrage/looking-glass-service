import { stringify } from 'querystring'
import { v4 } from 'uuid'

import config from '../config'
import AuthType from '../dto/authType'
import Sort from '../dto/sortResponse'
import Module from '../dto/moduleResponse'

const oAuthParams: any = {
  client_id: config.get('REDDIT_CLIENT_ID'),
  redirect_uri: 'http://localhost',
  response_type: 'code',
  state: v4(),
  duration: 'permanent',
  scope: 'read mysubreddits',
}

const timeSeries: Sort[] = [
  {
    id: 'hour',
    name: 'Hour',
  },
  {
    id: 'day',
    name: 'Day',
  },
  {
    id: 'week',
    name: 'Week',
  },
  {
    id: 'month',
    name: 'Month',
  },
  {
    id: 'year',
    name: 'Year',
  },
  {
    id: 'all',
    name: 'All Time',
  },
]

const definition: Module = {
  id: 'reddit',
  name: 'Reddit',
  description: 'Reddit is an American social news aggregation, web content rating, and discussion website.',
  authType: AuthType.OAuth,
  oAuthUrl: `https://www.reddit.com/api/v1/authorize.compact?${stringify(oAuthParams)}`,
  icon: `/reddit_icon.png`,
  supportsItemFilters: true,
  supportsAuthorFilter: true,
  supportsSourceFilter: true,
  filters: [
    {
      id: 'multireddit',
      name: 'Multireddits',
      description: 'Custom feeds',
      supportsMultiple: false,
      supportsSearch: true,
    },
    {
      id: 'subreddit',
      name: 'Subreddits',
      description: 'My communities',
      supportsMultiple: true,
      supportsSearch: true,
    },
    {
      id: 'user',
      name: 'Submitted By',
      description: 'See other posts submitted by this user',
      supportsMultiple: false,
      supportsSearch: false,
    },
  ],
  sort: [
    {
      id: 'hot',
      name: 'Hot',
      isDefault: true,
    },
    {
      id: 'best',
      name: 'Best',
    },
    {
      id: 'top',
      name: 'Top',
      availableInSearch: true,
    },
    ...timeSeries.map((t) => ({
      ...t,
      id: `top-${t.id}`,
      parentId: 'top',
      availableInSearch: true,
    })),
    {
      id: 'new',
      name: 'New',
      availableInSearch: true,
    },
    ...timeSeries.map((t) => ({
      ...t,
      id: `new-${t.id}`,
      parentId: 'new',
      exclusiveToSearch: true,
      availableInSearch: true,
    })),
    {
      id: 'rising',
      name: 'Rising',
    },
    {
      id: 'controversial',
      name: 'Controversial',
    },
    ...timeSeries.map((t) => ({
      ...t,
      id: `controversial-${t.id}`,
      parentId: 'controversial',
    })),
    {
      id: 'relevance',
      name: 'Relevance',
      isDefault: true,
      availableInSearch: true,
      exclusiveToSearch: true,
    },
    ...timeSeries.map((t) => ({
      ...t,
      id: `relevance-${t.id}`,
      parentId: 'relevance',
      exclusiveToSearch: true,
      availableInSearch: true,
    })),
    {
      id: 'comments',
      name: 'Total Comments',
      isDefault: true,
      availableInSearch: true,
      exclusiveToSearch: true,
    },
    ...timeSeries.map((t) => ({
      ...t,
      id: `comments-${t.id}`,
      parentId: 'comments',
      exclusiveToSearch: true,
      availableInSearch: true,
    })),
  ],
}

export default definition
