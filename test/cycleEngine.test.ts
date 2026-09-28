import assert from 'node:assert';
import { getCycleState, PHASE_CARD_DATA } from '../src/utils/cycleEngine.ts';
import type { CyclePhase } from '../src/utils/cycleEngine.ts';

console.log('Running Cycle Engine verification tests...');

// Test 1: Luteal Phase scenario (current time Sep 24, last period Sep 1)
{
  const lastPeriod = new Date(2026, 8, 1); // Sep 1, 2026
  const targetDate = new Date(2026, 8, 24); // Sep 24, 2026 (Day 24)
  const result = getCycleState(lastPeriod, 28, targetDate);

  assert.strictEqual(result.currentCycleDay, 24, 'Current cycle day should be 24');
  assert.strictEqual(result.phase.name, 'Luteal', 'Phase should be Luteal on day 24');

  // Verify daysUntilNextPeriod and periodExpectedDate match
  const msDiff = result.periodExpectedDate.getTime() - targetDate.getTime();
  const dayDiff = Math.round(msDiff / (1000 * 60 * 60 * 24));
  assert.strictEqual(result.daysUntilNextPeriod, dayDiff, 'daysUntilNextPeriod must match periodExpectedDate difference');
  assert.strictEqual(result.daysUntilNextPeriod, 5, 'Days until next period should be 5 from day 24');

  // Verify that ovulation is NOT upcoming before next period in Luteal phase
  const upcomingLabels = result.upcomingPhases.map(p => p.label);
  const periodIndex = result.upcomingPhases.findIndex(p => p.label === 'Period expected');
  const ovulationIndex = result.upcomingPhases.findIndex(p => p.phase === 'Ovulation');

  assert.ok(periodIndex !== -1, 'Period expected must be in upcoming list');
  if (ovulationIndex !== -1) {
    assert.ok(
      ovulationIndex > periodIndex,
      'Ovulation cannot appear before next period when user is in Luteal phase'
    );
  }

  // Verify chronological ordering of upcoming phases
  for (let i = 0; i < result.upcomingPhases.length - 1; i++) {
    assert.ok(
      result.upcomingPhases[i].startDate.getTime() <= result.upcomingPhases[i + 1].startDate.getTime(),
      'Upcoming phases must be sorted chronologically ascending'
    );
  }

  console.log('✓ Test 1: Luteal phase test passed');
}

// Test 2: Full cycle sweep (Day 1 through Day 28)
{
  const lastPeriod = new Date(2026, 8, 1);
  for (let day = 0; day < 28; day++) {
    const targetDate = new Date(2026, 8, 1 + day);
    const result = getCycleState(lastPeriod, 28, targetDate);

    // 1. daysUntilNextPeriod and periodExpectedDate agree
    const msDiff = result.periodExpectedDate.getTime() - targetDate.getTime();
    const dayDiff = Math.round(msDiff / (1000 * 60 * 60 * 24));
    assert.strictEqual(
      result.daysUntilNextPeriod,
      dayDiff,
      `Day ${day + 1}: daysUntilNextPeriod (${result.daysUntilNextPeriod}) must match periodExpectedDate (${dayDiff})`
    );

    // 2. Upcoming phases are chronologically sorted
    for (let i = 0; i < result.upcomingPhases.length - 1; i++) {
      assert.ok(
        result.upcomingPhases[i].startDate.getTime() <= result.upcomingPhases[i + 1].startDate.getTime(),
        `Day ${day + 1}: Upcoming phases must be chronologically sorted`
      );
    }

    // 3. If in Luteal phase, no ovulation appears before next period
    if (result.phase.name === 'Luteal') {
      const pIdx = result.upcomingPhases.findIndex(p => p.label === 'Period expected');
      const ovIdx = result.upcomingPhases.findIndex(p => p.phase === 'Ovulation');
      if (ovIdx !== -1 && pIdx !== -1) {
        assert.ok(ovIdx > pIdx, `Day ${day + 1} (Luteal): Ovulation cannot appear before next period`);
      }
    }

    // 4. Verify isFertile matches fertile window (days 9 through 14 for 28-day cycle)
    const expectedFertile = result.currentCycleDay >= 9 && result.currentCycleDay <= 14;
    assert.strictEqual(
      result.isFertile,
      expectedFertile,
      `Day ${result.currentCycleDay}: isFertile should be ${expectedFertile}`
    );
  }
  console.log('✓ Test 2: 28-day cycle sweep passed');
}

// Test 3: Phase Card Content verification (P1 requirements)
{
  const phases: CyclePhase[] = ['Menstrual', 'Follicular', 'Ovulation', 'Luteal'];
  const emDashRegex = /[\u2014\u2013]/; // em dash (—) and en dash (–) in content

  for (const p of phases) {
    const card = PHASE_CARD_DATA[p];
    assert.ok(card, `Card data must exist for phase ${p}`);
    assert.strictEqual(card.phase, p, `Phase must match ${p}`);
    assert.ok(card.summary.length > 0, `Summary must not be empty for ${p}`);
    assert.ok(!emDashRegex.test(card.summary), `Summary must not contain em dashes for ${p}`);

    assert.ok(card.symptoms.length >= 3 && card.symptoms.length <= 4, `Symptoms count should be 3-4 for ${p}`);
    for (const symptom of card.symptoms) {
      assert.ok(!emDashRegex.test(symptom), `Symptom must not contain em dashes: "${symptom}"`);
      // Check tone / hedging
      const hasHedging = /may|can|notice|feel|shifts|desire/i.test(symptom);
      assert.ok(hasHedging, `Symptom must use soft, hedged language: "${symptom}"`);
    }
  }
  console.log('✓ Test 3: Phase Card content and tone requirements passed');
}

// Test 4: Insights Chart — Fix 1: Accurate Proportional Scale & Bar Height
{
  const { INITIAL_CYCLE_DATA, computeChartScale, calculateAverageCycleLength, calculateCycleTrend } = await import('../src/utils/insightsChart.ts');
  const plotHeight = 120;
  const scale = computeChartScale(INITIAL_CYCLE_DATA);

  // Y-axis gridlines must exist and cover 25, 28, 31 for the standard dataset
  assert.deepStrictEqual(scale.gridLines, [25, 28, 31], 'Grid lines must be at 25, 28, 31 days');
  assert.strictEqual(scale.yMin, 20, 'Baseline yMin must be 20 days');
  assert.strictEqual(scale.yMax, 32, 'Ceiling yMax must be 32 days');

  // Verify bar heights for current dataset
  const heights = INITIAL_CYCLE_DATA.map(d => ({
    month: d.month,
    height: scale.toPixelHeight(d.length, plotHeight),
    length: d.length,
    periodHeight: d.period * scale.pixelsPerDay(plotHeight),
  }));

  const apr = heights.find(h => h.month === 'Apr')!;
  const may = heights.find(h => h.month === 'May')!;
  const jun = heights.find(h => h.month === 'Jun')!;
  const jul = heights.find(h => h.month === 'Jul')!;
  const aug = heights.find(h => h.month === 'Aug')!;
  const sep = heights.find(h => h.month === 'Sep')!;

  // 1. June (29) must clearly be the tallest bar
  assert.ok(jun.height > may.height, 'June (29) must be taller than May (28)');
  assert.ok(jun.height > apr.height, 'June (29) must be taller than April (27)');
  assert.strictEqual(jun.height, 90, 'June height must be exactly 90px on 120px plot');

  // 2. April (27) and August (27) must be shortest and exactly equal
  assert.strictEqual(apr.height, aug.height, 'April (27) and August (27) must be equal in height');
  assert.strictEqual(apr.height, 70, 'April and August height must be 70px on 120px plot');
  assert.ok(may.height > apr.height, 'May (28) must be taller than April (27)');

  // 3. Difference between 27 and 29 must be significant (20px out of 120px = 16.7% height difference)
  assert.strictEqual(jun.height - apr.height, 20, 'Difference between 27 and 29 must be 20px');

  // 4. Period segment must scale proportionally to actual duration
  const period4d = heights.find(h => h.month === 'Jun')!.periodHeight;
  const period5d = heights.find(h => h.month === 'May')!.periodHeight;
  const period6d = heights.find(h => h.month === 'Aug')!.periodHeight;

  assert.strictEqual(period4d, 40, '4-day period must be 40px');
  assert.strictEqual(period5d, 50, '5-day period must be 50px');
  assert.strictEqual(period6d, 60, '6-day period must be 60px');
  assert.ok(period6d > period5d && period5d > period4d, 'Period segment must scale strictly proportionally with duration');

  console.log('✓ Test 4: Insights Chart Fix 1 (Proportional Scale & Height) passed');

  // Test 5: Fix 2: Explicit Ongoing Cycle State
  const ongoingCycle = INITIAL_CYCLE_DATA.find(d => d.isOngoing);
  assert.ok(ongoingCycle, 'September must have isOngoing set to true');
  assert.strictEqual(ongoingCycle.month, 'Sep', 'Ongoing month must be September');
  assert.strictEqual(ongoingCycle.elapsedDays, 27, 'Elapsed days in ongoing cycle must be explicitly recorded');
  assert.strictEqual(ongoingCycle.length, 28, 'Projected length must be defined');

  console.log('✓ Test 5: Insights Chart Fix 2 (Ongoing Cycle State) passed');

  // Test 6: Fix 3: Average Cycle Length & Reference Line
  const avg = calculateAverageCycleLength(INITIAL_CYCLE_DATA);
  assert.strictEqual(avg, 27.8, 'Average of completed cycles (27, 28, 29, 28, 27) must be 27.8');

  // Reference line position matches exact scale
  const avgY = scale.toYCoord(avg, plotHeight);
  const line28Y = scale.toYCoord(28, plotHeight);
  assert.ok(avgY > line28Y, 'Average 27.8 line must be slightly below 28d line in Y coordinates');
  assert.strictEqual(Math.round(scale.toPixelHeight(avg, plotHeight)), 78, 'Average 27.8 height must be 78px');

  console.log('✓ Test 6: Insights Chart Fix 3 (Average Reference Line) passed');

  // Test 7: Fix 4: Trend Indicator
  const trend = calculateCycleTrend(INITIAL_CYCLE_DATA);
  assert.strictEqual(trend.direction, 'stable', 'Default dataset trend must be stable');
  assert.strictEqual(trend.label, 'Trending stable', 'Label must be calm "Trending stable"');
  assert.ok(Math.abs(trend.diff) <= 1.0, 'Difference must be within +/- 1.0 day threshold');

  console.log('✓ Test 7: Insights Chart Fix 4 (Trend Indicator) passed');

  // Test 8: Edge Cases (Flat history, Outlier history, Sparse history)
  // Edge Case A: Flat history (all 28 days)
  const flatData = [
    { month: 'Apr', length: 28, period: 5, notes: '' },
    { month: 'May', length: 28, period: 5, notes: '' },
    { month: 'Jun', length: 28, period: 5, notes: '' },
    { month: 'Jul', length: 28, period: 5, notes: '' },
  ];
  const flatTrend = calculateCycleTrend(flatData);
  assert.strictEqual(flatTrend.direction, 'stable', 'Flat history must report stable trend');
  assert.strictEqual(flatTrend.diff, 0, 'Flat history diff must be 0');
  assert.strictEqual(calculateAverageCycleLength(flatData), 28.0, 'Flat history average must be 28.0');

  // Edge Case B: Significant Outlier (38-day cycle)
  const outlierData = [
    { month: 'Apr', length: 27, period: 5, notes: '' },
    { month: 'May', length: 28, period: 5, notes: '' },
    { month: 'Jun', length: 38, period: 5, notes: 'Outlier cycle' },
    { month: 'Jul', length: 28, period: 5, notes: '' },
    { month: 'Aug', length: 27, period: 5, notes: '' },
  ];
  const outlierScale = computeChartScale(outlierData);
  assert.ok(outlierScale.yMax >= 38, 'Scale must accommodate 38-day outlier');
  const outlierAvg = calculateAverageCycleLength(outlierData);
  assert.strictEqual(outlierAvg, 29.6, 'Outlier average must recompute accurately to 29.6');

  // Edge Case C: Sparse data (2 months logged for new user)
  const sparseData = [
    { month: 'Aug', length: 27, period: 5, notes: 'First logged cycle' },
    { month: 'Sep', length: 28, period: 5, isOngoing: true, elapsedDays: 20, notes: 'Current cycle' },
  ];
  const sparseScale = computeChartScale(sparseData);
  assert.ok(sparseScale.yMax >= 28, 'Sparse scale must handle 2 months without breaking');
  assert.strictEqual(calculateAverageCycleLength(sparseData), 27, 'Sparse average must be 27 from single completed cycle');
  const sparseTrend = calculateCycleTrend(sparseData);
  assert.strictEqual(sparseTrend.direction, 'stable', 'Sparse trend must default to stable');

  console.log('✓ Test 8: Insights Chart Edge Cases (Flat, Outlier, Sparse) passed');
}

// Test 9: Symptoms Tab Part 6 — Bloating & All Phase Colors
{
  const { BASELINE_SYMPTOM_CATALOG, getSymptomInsights } = await import('../src/utils/insightsSymptoms.ts');
  const { PHASE_COLORS } = await import('../src/utils/cycleEngine.ts');

  const bloating = BASELINE_SYMPTOM_CATALOG.find(s => s.id === 'bloating')!;
  const fatigue = BASELINE_SYMPTOM_CATALOG.find(s => s.id === 'tired')!;

  // Part 6 Check: Bloating must use Luteal purple token, matching Fatigue
  assert.strictEqual(bloating.color, PHASE_COLORS.Luteal, 'Bloating must use Luteal color token');
  assert.strictEqual(bloating.color, fatigue.color, 'Bloating and Fatigue must both use Luteal color token');
  assert.strictEqual(bloating.color, '#B39ABF', 'Luteal token must be #B39ABF');

  // Verify all symptoms map directly to their canonical phase token
  for (const s of BASELINE_SYMPTOM_CATALOG) {
    if (s.primaryPhase === 'Period') {
      assert.strictEqual(s.color, PHASE_COLORS.Menstrual, `${s.name} must use Menstrual token`);
    } else {
      assert.strictEqual(s.color, PHASE_COLORS[s.primaryPhase], `${s.name} must use ${s.primaryPhase} token`);
    }
  }

  console.log('✓ Test 9: Symptoms Tab Part 6 (Bloating & Canonical Phase Colors) passed');
}

// Test 10: Symptoms Tab Part 1, 2, 5 — Calculation, Trend, and >5 Symptoms
{
  const { getSymptomInsights, SYMPTOM_TREND_STABLE_THRESHOLD_PERCENT } = await import('../src/utils/insightsSymptoms.ts');

  // Default / All
  const insights = getSymptomInsights({}, 'All');

  // Part 5: More than 5 symptoms supported in data
  assert.ok(insights.length >= 8, 'Symptom list must support more than 5 distinct symptoms');

  // Part 1: Frequency calculation is defined (% of tracked days in phase)
  for (const item of insights) {
    assert.ok(item.frequency >= 0 && item.frequency <= 100, `Frequency must be percentage: ${item.frequency}`);
    assert.ok(item.history.length > 0, `History points must exist for ${item.name}`);
  }

  // Part 2: Trend indicator (up, down, flat, delta)
  const cramps = insights.find(s => s.id === 'cramps')!;
  assert.strictEqual(cramps.trendDirection, 'up', 'Cramps (+8%) should have trendDirection="up"');
  assert.strictEqual(cramps.trendDeltaPercent, 8, 'Cramps delta should be +8%');

  const bloating = insights.find(s => s.id === 'bloating')!;
  assert.strictEqual(bloating.trendDirection, 'flat', 'Bloating (-4%) should be within <= 5% stable threshold');
  assert.strictEqual(bloating.trendDeltaPercent, -4, 'Bloating delta should be -4%');

  console.log('✓ Test 10: Symptoms Tab Part 1, 2, 5 (Frequencies, Trends, >5 items) passed');
}

// Test 11: Symptoms Tab Part 3 — Phase Filter Chips
{
  const { getSymptomInsights } = await import('../src/utils/insightsSymptoms.ts');

  const lutealSymptoms = getSymptomInsights({}, 'Luteal');
  assert.ok(lutealSymptoms.length > 0, 'Luteal filter must return items');
  for (const s of lutealSymptoms) {
    assert.strictEqual(s.primaryPhase, 'Luteal', `All filtered items must be Luteal: ${s.name}`);
  }

  const periodSymptoms = getSymptomInsights({}, 'Period');
  assert.ok(periodSymptoms.length > 0, 'Period filter must return items');
  for (const s of periodSymptoms) {
    assert.ok(s.primaryPhase === 'Period' || s.primaryPhase === 'Menstrual', `All filtered items must be Period: ${s.name}`);
  }

  console.log('✓ Test 11: Symptoms Tab Part 3 (Phase Filter Chips) passed');
}

// Test 12: Symptoms Tab Part 4 — Drill-down & Educational Article Matching
{
  const { getSymptomInsights, BASELINE_SYMPTOM_CATALOG } = await import('../src/utils/insightsSymptoms.ts');
  const validArticleIds = new Set([
    'luteal-phase-guide',
    'cramp-relief-methods',
    'hormonal-libido-wellness',
    'pads-vs-cups-guide',
  ]);

  const insights = getSymptomInsights({}, 'All');
  for (const s of insights) {
    if (s.matchedArticleId) {
      assert.ok(
        validArticleIds.has(s.matchedArticleId),
        `Matched article "${s.matchedArticleId}" for ${s.name} must exist in Articles Hub catalog`
      );
    }
  }

  // Verify that drill-down history has per-cycle points
  for (const s of BASELINE_SYMPTOM_CATALOG) {
    const item = insights.find(i => i.id === s.id)!;
    assert.ok(item.history.length >= 6, `Symptom ${s.name} must have 6 cycles of history for drill-down`);
  }

  console.log('✓ Test 12: Symptoms Tab Part 4 (Article Cross-referencing & History) passed');
}

console.log('All cycle engine tests passed successfully!');
