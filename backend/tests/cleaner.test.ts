import { describe, it, expect } from 'vitest';
import { cleanExtractedText } from '../src/utils/cleaner.js';

describe('Web & ChatGPT Text Cleaner', () => {
  it('should clean pseudo-JSX layout tags and badges into readable plain text', () => {
    const raw = `## Your Unit 1 preparation tracker

<box border radius="lg" padding={3} gap={3}>
  <row align="center" justify="between">
    **Question preparation**
    <badge color="success">8 questions completed</badge>
  </row>
  <box background="surface-tertiary" radius="full" height="9px" clip>
    <box background="#16A34A" height="9px" width="100%" radius="full"/>
  </box>
  <row justify="between">
    <text color="secondary" size="sm">PYQs: 4/4</text>
    <text color="secondary" size="sm">Mid questions: 4/4</text>
  </row>
  <divider color="subtle"/>
  **Remaining topics: 18**
  <text color="secondary" size="xs">These are the additional topics in your PDF, not yet covered by the eight answers.</text>
</box>

**My suggestion:** Prepare the 18 remaining topics as short exam answers.`;

    const cleaned = cleanExtractedText(raw);

    // Verify raw code tags are gone
    expect(cleaned).not.toContain('<box');
    expect(cleaned).not.toContain('</box>');
    expect(cleaned).not.toContain('<row');
    expect(cleaned).not.toContain('</row>');
    expect(cleaned).not.toContain('<badge');
    expect(cleaned).not.toContain('<text');
    expect(cleaned).not.toContain('clip>');

    // Verify text content is preserved and readable
    expect(cleaned).toContain('## Your Unit 1 preparation tracker');
    expect(cleaned).toContain('**Question preparation**');
    expect(cleaned).toContain('[8 questions completed]');
    expect(cleaned).toContain('PYQs: 4/4');
    expect(cleaned).toContain('Mid questions: 4/4');
    expect(cleaned).toContain('**Remaining topics: 18**');
    expect(cleaned).toContain('These are the additional topics in your PDF');
  });

  it('should strip FileCite tags', () => {
    const raw = 'Answer details here.<FileCite ref_id="turn0file0"/> Follow up note.';
    expect(cleanExtractedText(raw)).toBe('Answer details here. Follow up note.');
  });
});
