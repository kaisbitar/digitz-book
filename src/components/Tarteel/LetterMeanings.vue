<template>
  <v-list v-if="rootLetters.length" border rounded>
    <v-list-item
      v-for="(item, index) in rootLetters"
      :key="item.letter"
      :link="false"
      :ripple="false"
      class="py-4"
    >
      <div class="d-flex align-center ga-3 mb-2">
        <span class="text-h6">{{ item.letter }}</span>
        <span class="text-medium-emphasis">{{ item.name }}</span>
      </div>
      <div>{{ item.meaning }}</div>
      <v-divider v-if="index < rootLetters.length - 1" class="mt-4" />
    </v-list-item>
  </v-list>
</template>

<script setup>
const props = defineProps({
  root: {
    type: String,
    default: "",
  },
})

const letters = [
  {
    letter: "ء",
    name: "همزة",
    meaning:
      "ظهور ووضوح أخف من العين، كنصف رسمها. وعلى الألف يبقى الظهور ملتصقًا وغير مكتمل، في بعد زماني ومكاني.",
  },
  {
    letter: "ا",
    name: "ألف",
    meaning:
      "استمرار زماني ومكاني، ووسط الكلمة فاصل يمدّ الفعل. الممدودة امتداد زمني يُقاس، والمقصورة امتداد معنوي لا يُقاس.",
  },
  {
    letter: "ب",
    name: "باء",
    meaning: "ارتباط بواسطة الشيء، وسببية تصل بين طرفين.",
  },
  {
    letter: "ج",
    name: "جيم",
    meaning:
      "رجة ورجفة: ثبات بعد الحركة واستقرار بعد الانتقال، حركة وثبات في آن.",
  },
  {
    letter: "د",
    name: "دال",
    meaning:
      "في أول الكلمة دفع خفيف نحو جهة، وفي آخرها سدّ يُغلق المسار. معناه يتبدّل حسب موقعه.",
  },
  {
    letter: "هـ",
    name: "هاء",
    meaning:
      "بحث ولفّ: تردّد وعودة في الطلب نفسه. إيقاف البحث وبلوغ المسار يأتيان من غيرها.",
  },
  {
    letter: "و",
    name: "واو",
    meaning: "استمرار مكاني وموضعي، كموضع إقامة الصلوة والزكوة.",
  },
  {
    letter: "ز",
    name: "زاي",
    meaning: "تكرار يُزيح الشيء عن موضعه.",
  },
  {
    letter: "ح",
    name: "حاء",
    meaning:
      "حركة نامية: تبدأ في أول الكلمة، وتتعاظم في وسطها، وتبلغ أوجها في آخرها.",
  },
  {
    letter: "ط",
    name: "طاء",
    meaning: "دفع قوي يُحدث انفصالًا مفاجئًا، ثم يبلغ هذا الانفصال تمامه.",
  },
  {
    letter: "ي",
    name: "ياء",
    meaning: "استمرار زماني. وفي أول المضارع حدوث جارٍ يمتد في الزمن.",
  },
  {
    letter: "ك",
    name: "كاف",
    meaning:
      "ظهور متراكم على غيره: بدء التراكم في أول الكلمة، وبعضه في وسطها، وتمامه في آخرها.",
  },
  {
    letter: "ل",
    name: "لام",
    meaning:
      "شمول وإجمال: بدء الاكتمال في أول الكلمة، واستمراره في وسطها، وتمامه في آخرها.",
  },
  {
    letter: "م",
    name: "ميم",
    meaning: "إحاطة وتموضع. تبدأ أو تتوسط أو تكتمل حسب موقع الحرف.",
  },
  {
    letter: "ن",
    name: "نون",
    meaning:
      "احتواء وإنشاء مما سبق. في أول الكلمة خروج من المكان، وفي آخرها احتواء كامل.",
  },
  {
    letter: "س",
    name: "سين",
    meaning:
      "تحديد حركة منفصلة منظمة. في الأول يُحدَّد المسار من نقطة سكون، وفي الوسط والآخر سكون وثبات بعد الحركة.",
  },
  {
    letter: "ع",
    name: "عين",
    meaning: "ظهور ووضوح كامل وعمل، يكشف الشيء ظهورًا محسوسًا.",
  },
  {
    letter: "ف",
    name: "فاء",
    meaning: "انفصال عما قبله.",
  },
  {
    letter: "ص",
    name: "صاد",
    meaning: "حركة تصل الأشياء وتجمعها، وتكتمل دورانًا.",
  },
  {
    letter: "ق",
    name: "قاف",
    meaning:
      "قوة تُعمل فيما معها: تشتد بها الحركة، ويتم بها الانفصال، ويدور بها الجمع. هي شدة الفعل، لا الفعل نفسه.",
  },
  {
    letter: "ر",
    name: "راء",
    meaning: "تكرار الحركة داخل الكلمة، فتعود العملية على نفسها.",
  },
  {
    letter: "ش",
    name: "شين",
    meaning:
      "تشعّب وانتشار: يبدأ في أول الكلمة، ويجري في وسطها، وينتهي في آخرها.",
  },
  {
    letter: "ت",
    name: "تاء",
    meaning: "انقلاب الشيء على ذاته، فيفعل من تلقاء نفسه.",
  },
  {
    letter: "ث",
    name: "ثاء",
    meaning: "تفشٍّ منظم، انتشار منضبط.",
  },
  {
    letter: "خ",
    name: "خاء",
    meaning: "انفصال الحركة مع بقاء العلاقة.",
  },
  {
    letter: "ذ",
    name: "ذال",
    meaning:
      "تأشير أو تذليل يعيّن جهة الدفع وإلى أين. هي توجيه الحركة، لا دفعًا جديدًا.",
  },
  {
    letter: "ض",
    name: "ضاد",
    meaning: "تفريق، عكس الصاد في الجمع.",
  },
  {
    letter: "ظ",
    name: "ظاء",
    meaning: "انفصال يؤدي إلى اختفاء.",
  },
  {
    letter: "غ",
    name: "غين",
    meaning: "استتار، عكس العين في الظهور.",
  },
]

const letterByChar = Object.fromEntries(
  letters.map((item) => [item.letter[0], item]),
)

const toRootChar = (char) => {
  if ("أإآٱاىٰ".includes(char) || char === "\u0670") return "ا"
  if (char === "ة") return "ه"
  if (char === "ؤ") return "و"
  if (char === "ئ") return "ي"
  return char
}

const rootLetters = computed(() => {
  const root = String(props.root || "").replace(/[\u064B-\u0652\sـ]/g, "")
  if (!root) return []

  const seen = new Set()
  const rows = []
  for (const char of root) {
    const key = toRootChar(char)
    if (seen.has(key)) continue
    const item = letterByChar[key]
    if (!item) continue
    seen.add(key)
    rows.push(item)
  }
  return rows
})
</script>
