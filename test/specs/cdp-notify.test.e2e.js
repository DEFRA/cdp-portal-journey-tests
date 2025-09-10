import { expect } from '@wdio/globals'

import grafanaTriggerByStatus from '../messages/grafana/grafana-trigger-by-status.json' with { type: 'json' }
import grafanaTriggerByEnvironment from '../messages/grafana/grafana-trigger-by-environment.json' with { type: 'json' }
import grafanaTriggerByPagerDutyFlag from '../messages/grafana/grafana-trigger-by-pagerduty-flag.json' with { type: 'json' }
import grafanaTriggerRequiresService from '../messages/grafana/grafana-trigger-requires-service.json' with { type: 'json' }

import githubCreateWorkflowSuccess from '../messages/github/create-workflow-success.json' with { type: 'json' }
import githubCreateWorkflowFailed from '../messages/github/create-workflow-failed.json' with { type: 'json' }
import githubJourneyTestFailed from '../messages/github/journey-test-failed.json' with { type: 'json' }
import githubJourneyTestSuccess from '../messages/github/journey-test-success.json' with { type: 'json' }
import githubInfraFailed from '../messages/github/infra-test-failed.json' with { type: 'json' }
import githubInfraSuccess from '../messages/github/infra-test-success.json' with { type: 'json' }

describe('#cdp-notify', () => {
  beforeEach(async () => {
    await resetAlertStubs()
  })

  describe('Slack handler', () => {
    it('should send Slack messages when a create workflow fails', async () => {
      const payload = githubCreateWorkflowFailed
      await sendAlerts(payload, 'github')

      await waitForSlack(async (res) => {
        await expect(res).toHaveLength(1)
        await expect(res[0]).toMatchObject({
          team: 'platform',
          slack_channel: 'cdp-platform-alerts'
        })

        await expect(extractSlackText(res[0].message.attachments)).toEqual(
          expect.stringMatching(
            "cdp-create-workflows - 'forms-development-tools' failed"
          )
        )
      })
    })

    it('should not send a Slack messages when a create workflow passes', async () => {
      const payload = githubCreateWorkflowSuccess
      await sendAlerts(payload, 'github')

      await waitForSlack(async (res) => {
        await expect(res).toHaveLength(0)
      })
    })

    it('should send a Slack messages when portal journey tests fail', async () => {
      const payload = githubJourneyTestFailed
      await sendAlerts(payload, 'github')

      await waitForSlack(async (res) => {
        await expect(res).toHaveLength(1)
        await expect(res[0]).toMatchObject({
          team: 'platform',
          slack_channel: 'cdp-platform-alerts'
        })
      })
    })

    it('should NOT send a Slack messages when portal journey tests pass', async () => {
      const payload = githubJourneyTestSuccess
      await sendAlerts(payload, 'github')

      await waitForSlack(async (res) => {
        await expect(res).toHaveLength(0)
      })
    })

    it('should send a Slack messages when an infra repo fails', async () => {
      const payload = githubInfraFailed
      await sendAlerts(payload, 'github')

      await waitForSlack(async (res) => {
        res.sort((a, b) => (a.slack_channel < b.slack_channel ? 1 : -1))
        await expect(res).toHaveLength(2)

        await expect(res[0]).toMatchObject({
          team: 'platform',
          slack_channel: 'cdp-platform-alerts'
        })

        await expect(extractSlackText(res[0].message.attachments)).toEqual(
          expect.stringMatching(
            "cdp-tf-svc-infra - 'Manual Terraform Apply' failed"
          )
        )
        await expect(res[1]).toMatchObject({
          team: 'platform',
          slack_channel: 'cdp-infra-workflow-failures'
        })

        await expect(extractSlackText(res[1].message.attachments)).toEqual(
          expect.stringMatching(
            "cdp-tf-svc-infra - 'Manual Terraform Apply' failed"
          )
        )
      })
    })

    it('should NOT send a slack messages when infra-repo passes', async () => {
      const payload = githubInfraSuccess
      await sendAlerts(payload, 'github')

      await waitForSlack(async (res) => {
        await expect(res).toHaveLength(0)
      })
    })
  })

  describe('email handler', () => {
    it('should ignore the pager duty flag', async () => {
      const payload = grafanaTriggerByPagerDutyFlag

      // expect both alerts to be sent
      await sendAlerts(payload)

      await waitForEmail(async (res) => {
        await expect(res).toHaveLength(2)
      })
    })
  })

  describe('pagerduty handler', () => {
    it('should only trigger if pagerDuty field is set to true', async () => {
      const payload = grafanaTriggerByPagerDutyFlag

      await sendAlerts(payload)

      await waitForPagerDuty(async (res) => {
        await expect(res).toHaveLength(1)
        await expect(res[0]).toMatchObject({
          event_action: 'trigger',
          payload: {
            custom_details: {
              environment: payload[0].environment,
              service: payload[0].service,
              teams: ['Platform']
            },
            severity: 'critical',
            source: 'grafana',
            summary: payload[0].summary
          },
          routing_key: 'key'
        })
      })
    })

    it('should only trigger if the environment is production', async () => {
      const payload = grafanaTriggerByEnvironment

      await sendAlerts(payload)

      await waitForPagerDuty(async (res) => {
        await expect(res).toHaveLength(1)
        await expect(res[0]).toMatchObject({
          event_action: 'trigger',
          payload: {
            custom_details: {
              environment: payload[0].environment,
              service: payload[0].service,
              teams: ['Platform']
            },
            severity: 'critical',
            source: 'grafana',
            summary: payload[0].summary
          },
          routing_key: 'key'
        })
      })
    })

    it('should only trigger if the service field is set', async () => {
      const payload = grafanaTriggerRequiresService

      await sendAlerts(payload)

      await waitForPagerDuty(async (res) => {
        await expect(res).toHaveLength(1)
        await expect(res[0]).toMatchObject({
          event_action: 'trigger',
          payload: {
            custom_details: {
              environment: payload[0].environment,
              service: payload[0].service,
              teams: ['Platform']
            },
            severity: 'critical',
            source: 'grafana',
            summary: payload[0].summary
          },
          routing_key: 'key'
        })
      })
    })

    it('should only trigger the status is firing or resolved', async () => {
      const payload = grafanaTriggerByStatus

      await sendAlerts(payload)

      await waitForPagerDuty(async (res) => {
        await expect(res).toHaveLength(2)

        await expect(res[0]).toMatchObject({
          payload: {
            summary: payload[0].summary
          }
        })

        await expect(res[1]).toMatchObject({
          payload: {
            summary: payload[1].summary
          }
        })
      })
    })
  })
})

async function sendAlerts(alerts, source = 'grafana') {
  return fetch(`http://localhost:3939/_admin/alert/${source}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(alerts)
  })
}

async function resetAlertStubs() {
  await fetch('http://localhost:3939/_admin/pagerduty', {
    method: 'DELETE'
  })

  await fetch('http://localhost:3939/_admin/email', {
    method: 'DELETE'
  })

  await fetch('http://localhost:3939/_admin/slack', {
    method: 'DELETE'
  })
}

async function waitForSlack(fn, opts) {
  return waitFor('http://localhost:3939/_admin/slack', fn, opts)
}

async function waitForPagerDuty(fn, opts) {
  return waitFor('http://localhost:3939/_admin/pagerduty', fn, opts)
}

async function waitForEmail(fn, opts) {
  return waitFor('http://localhost:3939/_admin/email', fn, opts)
}

async function waitFor(url, fn, { retries = 5, interval = 1000 } = {}) {
  let lastError
  for (let i = 0; i < retries; i++) {
    try {
      const result = await fetch(url)
      const body = await result.json()
      await fn(body)
      return // success!
    } catch (err) {
      lastError = err
      if (i < retries - 1) {
        await new Promise((_resolve) => setTimeout(_resolve, interval))
      }
    }
  }
  throw new Error(`Retries exhausted for ${url}: ${lastError.message}`)
}

function extractSlackText(msg) {
  let out = ''
  for (const item of msg) {
    if (!(item && typeof item === 'object')) continue
    if (item.text) out += item.text
    if (Array.isArray(item.blocks)) out += extractSlackText(item.blocks)
    if (Array.isArray(item.elements)) out += extractSlackText(item.elements)
  }
  return out
}
