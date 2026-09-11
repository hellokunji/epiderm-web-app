import type {
  AnswersMap,
  AnswerValue,
  VisibilityOperator,
  VisibilityRule,
} from "@/lib/consult/types";

function asList(value: AnswerValue): unknown[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function compare(
  left: AnswerValue,
  operator: VisibilityOperator,
  right: unknown,
): boolean {
  const leftList = asList(left);
  const rightList = Array.isArray(right) ? right : [right];

  switch (operator) {
    case "EQUALS":
      return leftList.some((item) => String(item) === String(right));
    case "NOT_EQUALS":
      return leftList.every((item) => String(item) !== String(right));
    case "IN":
      return leftList.some((item) =>
        rightList.some((candidate) => String(candidate) === String(item)),
      );
    case "NOT_IN":
      return leftList.every(
        (item) =>
          !rightList.some((candidate) => String(candidate) === String(item)),
      );
    case "CONTAINS":
      return leftList.some((item) => String(item).includes(String(right)));
    default:
      return true;
  }
}

export function isRuleVisible(
  rule: VisibilityRule | undefined,
  answers: AnswersMap,
): boolean {
  if (!rule) return true;

  if ("rules" in rule) {
    const results = rule.rules.map((child) => isRuleVisible(child, answers));
    return rule.operator === "AND"
      ? results.every(Boolean)
      : results.some(Boolean);
  }

  return compare(answers[rule.field] ?? null, rule.operator, rule.value);
}
