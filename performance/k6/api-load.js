/**
 * K6 API Load Test — reqres.in
 *
 * NOTE: reqres.in free tier allows 250 requests/day.
 * This script is tuned to use ~30 requests per run (1 VU, 30s).
 * For higher load, upgrade to a paid reqres.in plan.
 *
 * Stages:
 *   Ramp up  →  Sustained load  →  Ramp down
 *
 * Run locally:
 *   npm run perf:api
 *
 * Run manually with custom VUs (only for paid plans):
 *   k6 run -e VUS=5 -e DURATION=1m performance/k6/api-load.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';

// ── Configuration ────────────────────────────────────────────────────────────

const VUS      = parseInt(__ENV.VUS      || '1');
const DURATION = __ENV.DURATION          || '30s';

export const options = {
  vus: VUS,
  duration: DURATION,
  thresholds: {
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    http_req_failed:   ['rate<0.05'],
    checks:            ['rate>0.95'],
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const BASE_URL = __ENV.API_BASE_URL || 'https://reqres.in';
const API_KEY  = __ENV.API_KEY      || '';

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

// ── Test Scenarios ────────────────────────────────────────────────────────────

export default function () {

  group('Users — list', () => {
    const res = http.get(`${BASE_URL}/api/users?page=1`, { headers });

    check(res, {
      'status is 200':         r => r.status === 200,
      'has page field':        r => r.json('page') === 1,
      'has data array':        r => Array.isArray(r.json('data')),
      'data is not empty':     r => Array.isArray(r.json('data')) && r.json('data').length > 0,
      'response time < 500ms': r => r.timings.duration < 500,
    });
  });

  sleep(1);

  group('Users — get by ID', () => {
    const res = http.get(`${BASE_URL}/api/users/2`, { headers });

    check(res, {
      'status is 200':         r => r.status === 200,
      'user id matches':       r => r.json('data.id') === 2,
      'has email field':       r => typeof r.json('data.email') === 'string',
      'response time < 500ms': r => r.timings.duration < 500,
    });
  });

  sleep(1);

  group('Users — not found', () => {
    const res = http.get(`${BASE_URL}/api/users/999`, { headers });

    check(res, {
      'status is 404':         r => r.status === 404,
      'response time < 500ms': r => r.timings.duration < 500,
    });
  });

  sleep(1);

  group('Users — create', () => {
    const payload = JSON.stringify({ name: 'k6-user', job: 'load-tester' });
    const res = http.post(`${BASE_URL}/api/users`, payload, { headers });

    check(res, {
      'status is 201':         r => r.status === 201,
      'has id':                r => typeof r.json('id') === 'string',
      'has createdAt':         r => typeof r.json('createdAt') === 'string',
      'name matches':          r => r.json('name') === 'k6-user',
      'response time < 500ms': r => r.timings.duration < 500,
    });
  });

  sleep(1);

  group('Auth — login (valid)', () => {
    const payload = JSON.stringify({ email: 'eve.holt@reqres.in', password: 'cityslicka' });
    const res = http.post(`${BASE_URL}/api/login`, payload, { headers });

    check(res, {
      'status is 200':         r => r.status === 200,
      'has token':             r => typeof r.json('token') === 'string',
      'response time < 500ms': r => r.timings.duration < 500,
    });
  });

  sleep(1);

  group('Auth — login (missing password)', () => {
    const payload = JSON.stringify({ email: 'peter@klaven.com' });
    const res = http.post(`${BASE_URL}/api/login`, payload, { headers });

    check(res, {
      'status is 400':         r => r.status === 400,
      'has error field':       r => typeof r.json('error') === 'string',
      'response time < 500ms': r => r.timings.duration < 500,
    });
  });

  sleep(2);
}
