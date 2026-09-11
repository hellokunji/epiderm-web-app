import type {
  ConsultCategory,
  QuestionnaireQuestion,
  QuestionnaireSchema,
  QuestionnaireStep,
} from "@/lib/consult/types";

function slug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function options(labels: string[]) {
  return labels.map((label) => ({ label, value: slug(label) }));
}

function selectQuestion(
  id: string,
  title: string,
  labels: string[],
  required: boolean,
  multi = false,
): QuestionnaireQuestion {
  return {
    id,
    title,
    type: multi ? "MULTI_SELECT" : "SINGLE_SELECT",
    ui_type: multi ? "CHIP_GROUP" : "RADIO_CARDS",
    hint: multi ? "Select all that apply" : undefined,
    required,
    options: options(labels),
  };
}

function fileQuestion(
  id: string,
  title: string,
  mimeTypes: string[],
  hint: string,
): QuestionnaireQuestion {
  const isVideo = mimeTypes.some((type) => type.startsWith("video/"));
  return {
    id,
    title,
    type: "FILE_UPLOAD",
    ui_type: "IMAGE_PICKER_GRID",
    hint,
    required: true,
    file_constraints: {
      max_files: 1,
      min_files: 1,
      max_size_mb: isVideo ? 50 : 15,
      allowed_mime_types: mimeTypes,
    },
  };
}

function step(
  number: number,
  title: string,
  questions: QuestionnaireQuestion[],
): QuestionnaireStep {
  return {
    step_id: `step_${number}`,
    title,
    groups: [
      {
        group_id: `group_step_${number}`,
        layout: "VERTICAL",
        questions,
      },
    ],
  };
}

export const skinQuestionnaire: QuestionnaireSchema = {
  questionnaire_id: "qv_skin_v1",
  category: "SKIN",
  version: 1,
  locale: "en_US",
  steps: [
    step(1, "Primary Concern & Location [Local]", [
      selectQuestion("skin_primary_concern", "What is your primary skin concern?", [
        "Acne & Pimples",
        "Hyperpigmentation & Dark Spots",
        "Redness & Rosacea",
        "Dryness & Eczema Patches",
        "Fine Lines & Wrinkles",
        "Uneven Texture",
      ], true),
      selectQuestion("skin_affected_area", "Where is the issue primarily located?", [
        "Full Face",
        "T-Zone (Forehead, Nose, Chin)",
        "Cheeks & Jawline",
        "Neck & Chest",
        "Back & Shoulders",
      ], true),
    ]),
    step(2, "Timeline & Progression", [
      selectQuestion(
        "skin_duration",
        "How long have you been experiencing this concern?",
        [
          "Less than 2 weeks",
          "2 to 4 weeks",
          "1 to 6 months",
          "More than 6 months",
        ],
        true,
      ),
      selectQuestion(
        "skin_progression_pattern",
        "How does the condition behave over time?",
        [
          "Sudden flare-up",
          "Gradual onset",
          "Comes and goes in cycles",
          "Constant and progressively worsening",
        ],
        true,
      ),
    ]),
    step(3, "Symptoms & Skin Type", [
      selectQuestion("skin_type", "How would you describe your baseline skin type?", [
        "Oily",
        "Dry",
        "Combination (Oily T-zone, dry cheeks)",
        "Normal",
        "Highly Sensitive",
      ], true),
      selectQuestion(
        "skin_symptoms",
        "Are you experiencing any of the following physical symptoms?",
        [
          "Itching",
          "Pain or tenderness",
          "Burning or stinging sensation",
          "Flaking or peeling",
          "Pus-filled bumps",
          "Bleeding or oozing",
          "None of the above",
        ],
        false,
        true,
      ),
    ]),
    step(4, "Medical History & Triggers", [
      selectQuestion(
        "skin_current_treatments",
        "What products or medications are you currently using on your skin?",
        [
          "Over-the-counter acne creams (Benzoyl Peroxide / Salicylic Acid)",
          "Prescription topical treatments (Retinoids / Antibiotics)",
          "Oral prescription medications",
          "Gentle cleanser & moisturizer only",
          "None",
        ],
        false,
        true,
      ),
      selectQuestion(
        "skin_known_triggers",
        "Have you noticed any triggers that worsen the condition?",
        [
          "Sun exposure",
          "Stress",
          "Specific foods or dairy",
          "New cosmetic/skincare product",
          "Hormonal cycles",
          "None / Unsure",
        ],
        false,
        true,
      ),
    ]),
    step(5, "Visual Assessment Uploads", [
      fileQuestion(
        "skin_close_up_image",
        "Upload a clear, well-lit photo of the affected area",
        ["image/jpeg", "image/png"],
        "JPEG or PNG, well-lit, in focus",
      ),
      fileQuestion(
        "skin_scan_video",
        "Upload a short 5-10 second video scanning the affected region",
        ["video/mp4", "video/quicktime"],
        "MP4 or QuickTime, 5–10 seconds",
      ),
    ]),
  ],
};

export const hairQuestionnaire: QuestionnaireSchema = {
  questionnaire_id: "qv_hair_v1",
  category: "HAIR",
  version: 1,
  locale: "en_US",
  steps: [
    step(1, "Primary Scalp & Hair Issue [Local]", [
      selectQuestion(
        "hair_primary_concern",
        "What is your main hair or scalp issue?",
        [
          "Excessive Hair Shedding / Fall out",
          "Receding Hairline or Bald Patches",
          "Overall Hair Thinning (Decreased volume)",
          "Dandruff & Flaking",
          "Itchy & Irritated Scalp",
          "Scalp Bumps or Acne",
        ],
        true,
      ),
      selectQuestion(
        "hair_loss_pattern",
        "Where do you notice the hair loss or thinning the most?",
        [
          "Receding hairline / Temples",
          "Crown or top of the head",
          "Widen hair partition (Diffuse thinning)",
          "Patchy circular spots",
          "Entire scalp equally",
          "Not experiencing hair loss (Scalp issue only)",
        ],
        true,
      ),
    ]),
    step(2, "Shedding & Timeline", [
      selectQuestion(
        "hair_duration",
        "How long have you noticed this hair/scalp concern?",
        [
          "Less than 1 month",
          "1 to 3 months",
          "3 to 12 months",
          "More than 1 year",
        ],
        true,
      ),
      selectQuestion(
        "hair_daily_shedding",
        "How many hair strands do you estimate losing daily?",
        [
          "Normal (Under 50 strands/day)",
          "Moderate (50 to 100 strands/day)",
          "Severe (Over 100 strands/day)",
          "Losing hair in clumps while washing/combing",
        ],
        true,
      ),
    ]),
    step(3, "Scalp Health & Symptoms", [
      selectQuestion(
        "hair_scalp_type",
        "How would you describe your scalp oil level?",
        [
          "Extremely Oily (Greasy within 24 hours of washing)",
          "Dry & Tight",
          "Normal / Balanced",
          "Fluctuates seasonally",
        ],
        true,
      ),
      selectQuestion(
        "hair_scalp_symptoms",
        "Select any scalp discomfort symptoms you experience:",
        [
          "Flaking (White dry flakes)",
          "Flaking (Yellow greasy flakes)",
          "Persistent itching",
          "Scalp tenderness / Pain at roots",
          "Bumps, pimples, or sores",
          "Redness or inflammation",
          "None",
        ],
        false,
        true,
      ),
    ]),
    step(4, "Health & Lifestyle History", [
      selectQuestion(
        "hair_health_triggers",
        "Have you experienced any of the following in the past 3–6 months?",
        [
          "High emotional or physical stress",
          "Major illness, fever, or surgery",
          "Rapid weight loss or strict diet changes",
          "Hormonal changes (Thyroid, PCOS, Post-partum)",
          "Family history of early hair loss / baldness",
          "None of the above",
        ],
        false,
        true,
      ),
      selectQuestion(
        "hair_current_treatments",
        "What hair treatments are you currently using?",
        [
          "Minoxidil or Finasteride",
          "Anti-dandruff / Medicated shampoo",
          "Hair growth oils or serums",
          "Nutritional supplements (Biotin, Iron)",
          "Regular shampoo & conditioner only",
        ],
        false,
        true,
      ),
    ]),
    step(5, "Scalp Visual Uploads", [
      fileQuestion(
        "hair_scalp_image",
        "Upload a clear photo showing your scalp line / parting under bright light",
        ["image/jpeg", "image/png"],
        "JPEG or PNG, bright light, show the parting",
      ),
      fileQuestion(
        "hair_scalp_video",
        "Upload a 5-10 second video slowly parting your hair from hairline to crown",
        ["video/mp4", "video/quicktime"],
        "MP4 or QuickTime, 5–10 seconds",
      ),
    ]),
  ],
};

export function questionnaireFixture(
  category: ConsultCategory,
): QuestionnaireSchema {
  return category === "HAIR" ? hairQuestionnaire : skinQuestionnaire;
}
