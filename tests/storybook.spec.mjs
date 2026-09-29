import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const entries = Object.values(JSON.parse(readFileSync('storybook-static/index.json', 'utf8')).entries).filter(entry => entry.type === 'story');
const open = async (page, id, theme = 'dark') => {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await expect(page.locator('.sb-page')).toBeVisible();
};

for (const theme of ['dark', 'light', 'snow']) {
  test(`all stories render in ${theme}, including narrow screens`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const story of entries) {
      await open(page, story.id, theme);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('#storybook-root')).not.toContainText('Unable to render');
      await page.setViewportSize({ width: 390, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), story.id).toBe(true);
      await page.setViewportSize({ width: 1280, height: 900 });
    }
    expect(errors).toEqual([]);
  });
}

test('validation prevents submission, describes errors, and clears corrected fields', async ({ page }) => {
  await open(page, 'controls-forms--validation');
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await expect(page.getByLabel('Workspace name')).toBeFocused();
  await expect(page.getByLabel('Workspace name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[role=alert]')).toHaveCount(2);
  await page.getByLabel('Workspace name').fill('Sample');
  await page.getByLabel('Email', { exact: true }).fill('alex@example.com');
  await expect(page.locator('[role=alert]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await expect(page.getByRole('status')).toContainText('No data was sent');
});

test('custom select supports keyboard selection and outside dismissal', async ({ page }) => {
  await open(page, 'controls-forms--custom-select');
  const trigger = page.getByRole('button', { name: 'Default appearance Ink' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Selected value: snow');
  await expect(page.locator('[aria-haspopup]')).toBeFocused();
  await page.locator('[aria-haspopup]').click();
  await page.getByRole('heading', { level: 1 }).click();
  await expect(page.getByRole('listbox')).toBeHidden();
});

test('dialog returns focus after Escape and works after reopening', async ({ page }) => {
  await open(page, 'controls-dialogs--confirmation');
  const trigger = page.getByRole('button', { name: 'Delete sample draft' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('button', { name: 'Delete draft', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Sample draft deleted.');
});

test('personal menu keyboard navigation and dismissal', async ({ page }) => {
  await open(page, 'controls-navigation--personal-menu');
  const trigger = page.getByRole('button', { name: 'Open personal menu' });
  await trigger.click();
  await expect(page.getByRole('button', { name: 'Account settings' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('decision controls update state and keyboard movement remains available', async ({ page }) => {
  await open(page, 'patterns-decisions--choices');
  await page.getByRole('button', { name: /Explore the whole/ }).click();
  await expect(page.getByRole('button', { name: /Explore the whole/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /Start small/ })).toHaveAttribute('aria-pressed', 'false');
  await open(page, 'patterns-decisions--ranking');
  await page.getByRole('button', { name: 'Move invite the team down' }).click();
  await expect(page.locator('.sumi-rank-row').first()).toContainText('Create a workspace');
  await open(page, 'patterns-decisions--bucket-sorter');
  await page.getByRole('button', { name: 'Move to Later' }).click();
  await expect(page.locator('[data-drop-value=later]')).toContainText('Invite the team');
  await page.locator('[data-drag-id]').dragTo(page.locator('[data-drop-value=now]'));
  await expect(page.locator('[data-drop-value=now]')).toContainText('Invite the team');
});

test('manager loads and toolbar changes the preview theme', async ({ page }) => {
  await page.goto('/?path=/story/foundations-design-language--introduction');
  const preview = page.frameLocator('#storybook-preview-iframe');
  await expect(preview.getByRole('heading', { name: '墨 Sumi' })).toBeVisible();
  await page.getByRole('button', { name: 'Ink' }).click();
  await page.getByText('Paper', { exact: true }).click();
  await expect(preview.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.screenshot({ path: test.info().outputPath('storybook.png'), fullPage: true });
});
