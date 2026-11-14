// প্রাথমিক প্রদর্শনী কনটেন্ট — অ্যাডমিন প্যানেল থেকে ডাটাবেজের আসল তথ্য আসার আগে ব্যবহৃত হয়।

export const defaultSettings = {
  site_name: "আল আহসান ফাউন্ডেশন বাংলাদেশ",
  short_name: "আল আহসান",
  tagline: "মানবতার সেবায়, স্বচ্ছতার প্রতিশ্রুতিতে",
  hero_title: "প্রতিটি অনুদান পৌঁছে যায় সঠিক মানুষের হাতে",
  hero_subtitle:
    "শিক্ষা, খাদ্য, চিকিৎসা ও বিশুদ্ধ পানি — বাংলাদেশের প্রান্তিক মানুষের পাশে দাঁড়াচ্ছি স্বচ্ছ হিসাব এবং যাচাইযোগ্য রসিদের সঙ্গে।",
  hero_video_url: "",
  logo_url: "",
  hero_poster_url:
    "https://media.base44.com/images/public/6af42d34cec1efa6b0808e7b/a061c0862_generated_7199abf1.png",
  about_text:
    "আল আহসান ফাউন্ডেশন বাংলাদেশ একটি অরাজনৈতিক, অলাভজনক মানবিক সংস্থা। ২০১৯ সাল থেকে আমরা শিক্ষা, খাদ্য নিরাপত্তা, প্রাথমিক চিকিৎসা ও বিশুদ্ধ পানি সরবরাহে কাজ করছি। আমাদের প্রতিটি টাকার হিসাব ওয়েবসাইটে প্রকাশিত এবং প্রতিটি রসিদে QR কোড দিয়ে যাচাই করা যায়।",
  hotline: "+8809611399315",
  email: "alahsanfoundationbangladesh@gmail.com",
  address: "ঢাকা, বাংলাদেশ",
  receipt_title: "অফিসিয়াল অনুদান রসিদ",
  receipt_footer:
    "এই রসিদটি আল আহসান ফাউন্ডেশন বাংলাদেশ-এর অফিসিয়াল ওয়েবসাইটে QR কোড স্ক্যান করে যাচাই করা যায়।",
  theme_primary: "#004D40",
  theme_accent: "#D4AF37",
  theme_surface: "#F9F9F9",
  facebook_url: "",
  youtube_url: "",
  monthly_donation_note:
    "মাসিক অনুদান কেবল পুনরাবৃত্ত পেমেন্ট সমর্থন করে এমন গেটওয়ে সংযুক্ত হলে চালু করা যাবে।",
  hero_button_member: "সদস্য হন",
  hero_button_auto: "অটো ডোনেশন",
  donor_label: "ডোনার ড্যাশবোর্ড",
  donor_link: "/verify",
  office_hours: "শনি – বৃহস্পতি, সকাল ১০টা থেকে বিকাল ৫টা",
  featured_video_url: "",
  campaign_image_url:
    "https://media.base44.com/images/public/6af42d34cec1efa6b0808e7b/a061c0862_generated_7199abf1.png",
  hero_slides_enabled: true,
  hero_interval: 6,
  hero_effect: "fade",
  carousel_enabled: true,
  carousel_interval: 5,
  overview_enabled: true,
  overview_title: "আমাদের কার্যক্রম ওভারভিউ",
  overview_subtitle: "ছবি ও ভিডিওতে দেখুন আমাদের কাজ কেমন চলছে — সবকিছু নিজে নিজেই বদলে যাবে।",
  overview_interval: 6,
  overview_media: [
    {
      media_type: "image",
      url: "https://media.base44.com/images/public/6af42d34cec1efa6b0808e7b/a061c0862_generated_7199abf1.png",
      title: "শীতবস্ত্র ও খাদ্য সামগ্রী বিতরণ",
      caption: "কুড়িগ্রাম",
      enabled: true,
    },
    {
      media_type: "image",
      url: "https://media.base44.com/images/public/6af42d34cec1efa6b0808e7b/060c9a74c_generated_431a925e.png",
      title: "নিরাপদ পানি প্রকল্প",
      caption: "সাতক্ষীরা",
      enabled: true,
    },
  ],
  projects_enabled: true,
  projects_title: "আমাদের প্রকল্প",
  projects_subtitle: "বর্তমানে চলমান প্রকল্পগুলো দেখুন এবং যেকোনো প্রকল্পে সরাসরি অনুদান দিন।",
  hero_slides: [
    {
      image_url:
        "https://media.base44.com/images/public/6af42d34cec1efa6b0808e7b/a061c0862_generated_7199abf1.png",
      title: "মানবতার সেবায় পাশে দাঁড়ান",
      subtitle: "আপনার অনুদানে একটি পরিবারের খাদ্য, শিক্ষা ও চিকিৎসা নিশ্চিত হয়।",
    },
    {
      image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80",
      title: "প্রতিটি শিশুর জন্য শিক্ষা",
      subtitle: "সুবিধাবঞ্চিত শিশুদের জন্য শিক্ষা উপকরণ ও বৃত্তি কার্যক্রম।",
    },
    {
      image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&q=80",
      title: "স্বচ্ছ হিসাব, যাচাইযোগ্য রসিদ",
      subtitle: "প্রতিটি টাকার হিসাব প্রকাশিত, প্রতিটি রসিদ QR কোডে যাচাইযোগ্য।",
    },
  ],
  mission_items: [
    { title: "শিক্ষা সহায়তা", description: "সুবিধাবঞ্চিত শিক্ষার্থীদের বই, খাতা, ইউনিফর্ম ও বৃত্তি প্রদান।" },
    { title: "খাদ্য নিরাপত্তা", description: "অসহায় পরিবারের জন্য নিয়মিত খাদ্য সামগ্রী ও ইফতার বিতরণ।" },
    { title: "প্রাথমিক চিকিৎসা", description: "বিনামূল্যে চিকিৎসা ক্যাম্প ও জরুরি ঔষধ সহায়তা।" },
    { title: "বিশুদ্ধ পানি", description: "আর্সেনিকমুক্ত গভীর নলকূপ স্থাপন ও পানি বিশুদ্ধকরণ ব্যবস্থা।" },
  ],
  faqs: [
    {
      question: "অনলাইনে অনুদান দিতে কী লাগবে?",
      answer:
        "‘দান করুন’ বাটনে চাপ দিয়ে পরিমাণ ও তহবিল নির্বাচন করুন, তারপর আপনার নাম ও মোবাইল নম্বর দিয়ে এগিয়ে যান। পেমেন্ট সম্পন্ন হলে সাথে সাথেই যাচাইযোগ্য ডিজিটাল রসিদ পাবেন।",
    },
    {
      question: "সদস্য হওয়ার প্রক্রিয়া কী?",
      answer:
        "সদস্যপদ পৃষ্ঠায় গিয়ে ফর্মটি সঠিকভাবে পূরণ করুন। অ্যাডমিন অনুমোদনের পর আপনার সদস্য নম্বর ও ডিজিটাল সার্টিফিকেট তৈরি হবে।",
    },
    {
      question: "অনুদানের রসিদ কিভাবে যাচাই করব?",
      answer:
        "রসিদে থাকা QR কোড স্ক্যান করুন অথবা ‘রসিদ যাচাই’ পৃষ্ঠায় রসিদ নম্বর দিন। আপনার অনুদানের তথ্য সরাসরি ফাউন্ডেশনের হিসাব থেকে দেখানো হবে।",
    },
    {
      question: "যাকাতের অর্থ কি আলাদা তহবিলে যায়?",
      answer:
        "হ্যাঁ। যাকাতের অর্থ সম্পূর্ণ আলাদা তহবিলে সংরক্ষিত থাকে এবং শুধুমাত্র যাকাতের নির্ধারিত খাতেই ব্যয় হয়।",
    },
  ],
  footer_links: [
    { label: "শর্তাবলী", to: "/terms" },
    { label: "গোপনীয়তা নীতি", to: "/privacy" },
    { label: "ফেরত নীতি", to: "/refund" },
  ],
};

export const sampleActivities = [
  {
    id: "sample-1",
    title: "শীতবস্ত্র ও খাদ্য সামগ্রী বিতরণ",
    category: "খাদ্য সহায়তা",
    location: "কুড়িগ্রাম",
    event_date: "2026-01-18",
    summary:
      "প্রতিকূল শীতে ৪২০টি পরিবারের মাঝে কম্বল, শীতবস্ত্র ও এক মাসের খাদ্য সামগ্রী পৌঁছে দেওয়া হয়েছে।",
    image_url:
      "https://media.base44.com/images/public/6af42d34cec1efa6b0808e7b/a061c0862_generated_7199abf1.png",
    target_amount: 450000,
    raised_amount: 318500,
    donor_count: 214,
    status: "active",
  },
  {
    id: "sample-2",
    title: "নিরাপদ পানি প্রকল্প — ১২টি গভীর নলকূপ",
    category: "বিশুদ্ধ পানি",
    location: "সাতক্ষীরা",
    event_date: "2026-02-04",
    summary:
      "আর্সেনিকমুক্ত পানির জন্য ১২টি পরিবারে গভীর নলকূপ স্থাপন। প্রতি নলকূপে উপকৃত হচ্ছে গড়ে ৬টি পরিবার।",
    image_url:
      "https://media.base44.com/images/public/6af42d34cec1efa6b0808e7b/060c9a74c_generated_431a925e.png",
    target_amount: 620000,
    raised_amount: 441000,
    donor_count: 168,
    status: "active",
  },
  {
    id: "sample-3",
    title: "বিনামূল্যে চিকিৎসা ক্যাম্প",
    category: "স্বাস্থ্যসেবা",
    location: "সুনামগঞ্জ",
    event_date: "2026-03-09",
    summary:
      "বিশেষজ্ঞ চিকিৎসকদের মাধ্যমে ৭৬০ জন রোগীর বিনামূল্যে পরামর্শ, ওষুধ ও ডায়াবেটিস-রক্তচাপ পরীক্ষা।",
    image_url:
      "https://media.base44.com/images/public/6af42d34cec1efa6b0808e7b/330e966bb_generated_e72d6950.png",
    target_amount: 300000,
    raised_amount: 187500,
    donor_count: 132,
    status: "active",
  },
  {
    id: "sample-4",
    title: "ঝরে পড়া শিশুদের জন্য পাঠশালা",
    category: "শিক্ষা",
    location: "ঢাকা",
    event_date: "2026-04-02",
    summary:
      "৩টি বস্তিবিদ্যালয়ে ২১০ জন শিশুর জন্য বিনামূল্যে বই, স্কুল ব্যাগ, শিক্ষক সম্মানী ও দুপুরের খাবার।",
    image_url:
      "https://media.base44.com/images/public/6af42d34cec1efa6b0808e7b/6c8964824_generated_336cda59.png",
    target_amount: 520000,
    raised_amount: 362000,
    donor_count: 190,
    status: "active",
  },
];

export const sampleStats = {
  totalDonation: 12458300,
  projects: 86,
  members: 1240,
  districts: 42,
};

export const sampleTicker = [
  { kind: "donation", text: "২,৫০০ টাকা অনুদান — শীতবস্ত্র তহবিল", time: "৭ মিনিট আগে" },
  { kind: "expense", text: "১৮,৪০০ টাকা ব্যয় — ৬০টি কম্বল ক্রয়", time: "৩২ মিনিট আগে" },
  { kind: "receipt", text: "রসিদ AAF-2026-000482 যাচাই সম্পন্ন", time: "১ ঘণ্টা আগে" },
  { kind: "donation", text: "১,০০০ টাকা মাসিক অনুদান — পাঠশালা প্রকল্প", time: "১ ঘণ্টা আগে" },
  { kind: "expense", text: "৯,২০০ টাকা ব্যয় — চিকিৎসা ক্যাম্পের ওষুধ", time: "২ ঘণ্টা আগে" },
];