export const standardDocuments = [
  { id: "passport", label: "Passport Data Page", required: true },
  { id: "transcript", label: "High School Transcript", required: true },
  { id: "wassce", label: "WASSCE/SSCE/NECO Result", required: true },
  { id: "cv", label: "CV / Resume", required: true },
  { id: "sop", label: "Statement of Purpose / Personal Statement", required: true },
  { id: "recommendations", label: "Recommendation Letters (2)", required: true },
  { id: "english", label: "English Proficiency (IELTS/TOEFL)", required: false, note: "Check university waiver policy" },
  { id: "financial", label: "Bank Statement / Financial Support", required: false, note: "For visa mainly, sometimes admission" }
];

export const universities = [
  {
    id: "uoft",
    name: "Univ. of Toronto",
    location: "Toronto, Ontario",
    deadline: "Jan 15, 2026",
    scholarships: [
      { 
        name: "Lester B. Pearson", 
        value: "Full Ride (Tuition + Living)", 
        notes: "Closed for '26 (Nov 7). Requires nomination." 
      },
      { 
        name: "Intl. Scholar Award", 
        value: "$100,000 – $180,000", 
        notes: "Automatic Consideration. Awarded to the top ~5% of applicants based on WASSCE grades. No separate app needed." 
      },
      { 
        name: "U of T Scholars", 
        value: "$10,000", 
        notes: "Automatic. ~95% avg (Mostly A1s)." 
      }
    ],
    appFee: "~$180–$256 CAD",
    tuition: "$61,720 – $72,260 (Highest in Canada)",
    roomBoard: "$16,000 – $26,000 (High cost of living)",
    insights: "Your Best Bet: Since the Pearson deadline passed, focus on the **$100k International Scholar Award**. You are automatically considered just by applying.\n\n💡 Tip: Apply by Dec 15 to get your file reviewed early for these funds."
  },
  {
    id: "ubc",
    name: "Univ. of British Columbia",
    location: "Vancouver & Okanagan, BC",
    deadline: "Jan 15, 2026",
    scholarships: [
      { 
        name: "Intl. Scholars Program (ISP)", 
        value: "Full Ride (Tuition + Living)", 
        notes: "Need + Merit Based. Includes Karen McKellin Leader of Tomorrow & Donald A. Wehrung Award. Requires School Nomination. Closed (Nov 15)." 
      },
      { 
        name: "IMES (Merit-Based)", 
        value: "$10k–$20k/year (Renewable)", 
        notes: "Automatic Consideration. Based heavily on \"Personal Profile\" essays & WASSCE grades." 
      },
      { 
        name: "OIS (Merit-Based)", 
        value: "$10k–$25k (One-time)", 
        notes: "Automatic Consideration." 
      },
      {
        name: "Okanagan Specific",
        value: "$5,000 - $8,000",
        notes: "Global Elevation ($8k/yr renewable) & Welcome Award ($5k one-time)."
      }
    ],
    appFee: "$173.25 CAD (Non-refundable)",
    tuition: "$49,500 – $64,100 CAD (Varies by Program)",
    roomBoard: "$14,000 – $17,400 CAD (Residence + Meal Plan)",
    insights: "Your \"Full Ride\" Opportunity:\nThe International Scholars Program (ISP) is your only chance for 100% funding at UBC.\n\n🚨 Critical: You cannot apply for both ISP and Merit awards. You must choose. If you need a full ride, you must get nominated by your school headmaster by Nov 15.\n\n💡 Essay Strategy: Unlike other schools, UBC places huge weight on your \"Personal Profile\" essays. A student with 6 A1s can lose to a student with 4 A1s if the second student has better essays about leadership.\n\n📍 Campus Choice: The Okanagan campus is cheaper and offers specific awards (Global Elevation) that the Vancouver campus does not. Consider this if budget is tight."
  },
  {
    id: "york",
    name: "York University",
    location: "Toronto, Ontario",
    deadline: "Jan 26, 2026 (Scholarship)",
    scholarships: [
      { 
        name: "President's Intl. Scholarship of Excellence", 
        value: "$180,000 ($45,000 x 4 years)", 
        notes: "Criteria: Highest academic average (A grade), leadership, volunteer work. Requires school nomination. Deadline: Jan 26, 2026." 
      },
      { 
        name: "Tentanda Via Award", 
        value: "$120,000 ($30,000 x 4 years)", 
        notes: "Criteria: Resilience in overcoming barriers or impact on sustainable development." 
      },
      { 
        name: "Global Leader of Tomorrow", 
        value: "$80,000 ($20,000 x 4 years)", 
        notes: "Criteria: High academic standing & community leadership." 
      },
      { 
        name: "Automatic Entrance Awards", 
        value: "$2,500 – $37,500", 
        notes: "Based on admission average. No separate application required." 
      }
    ],
    appFee: "$140 CAD",
    tuition: "$38,465 – $46,064 CAD (Arts: ~$38k, Eng: ~$46k)",
    roomBoard: "$12,500 – $19,700 CAD",
    insights: "The \"Safety\" & \"Leadership\" Choice:\n• York is less competitive for admission than U of T but offers massive scholarship money for leaders.\n\n• Action: If you are a School Prefect or SRC leader, you must apply for the President's International Scholarship. It is one of the largest in Canada.\n\n• Nomination: You need a nomination letter from your headmaster by January 26.\n\n• Backup: Even if you miss the big award, the automatic entrance scholarships are generous compared to other Ontario schools."
  },
  {
    id: "sfu",
    name: "Simon Fraser Univ.",
    location: "Burnaby, BC",
    deadline: "Dec 15, 2025 (Scholarship)",
    scholarships: [
      { 
        name: "Undergraduate Scholars Entrance (USES)", 
        value: "~$100,000 – $140,000+ (Tuition + Living)", 
        notes: "Criteria: Superior academics (90%+ / A1s), leadership, & community service. Requires separate app + essays + references by Dec 15." 
      },
      { 
        name: "Lloyd Carr-Harris (Business)", 
        value: "~$20,000", 
        notes: "Top applicant to Beedie School of Business (Automatic)." 
      },
      { 
        name: "Intl. Excellence Entrance", 
        value: "~$10,000 (One-time)", 
        notes: "Criteria: 90%+ average in WASSCE (Automatic for priority programs)." 
      }
    ],
    appFee: "$130 CAD",
    tuition: "$37,442 – $42,000 CAD",
    roomBoard: "~$14,370 – $16,000 CAD",
    insights: "The \"Hidden\" Deadline:\n• Critical: Unlike other schools with Jan/Feb deadlines, SFU's big money deadline is December 15. You must apply for admission and the scholarship by then.\n\n• Application Trick: You need an SFU Student Number to apply for the scholarship. This means you must submit your admission application (at apply.educationplannerbc.ca) at least 5 days before Dec 15 to get your ID in time.\n\n• Eligibility Note: The H.Y. Louie and Lohn awards found on some sites are for Canadians only. Do not waste time applying for them.\n\n• Weather: SFU is on top of a mountain (Burnaby Mountain). It is beautiful but often foggy/rainy compared to the city center."
  },
  {
    id: "concordia",
    name: "Concordia Univ.",
    location: "Montreal, Quebec",
    deadline: "Feb 1, 2026",
    scholarships: [
      { 
        name: "Intl. Student Excellence", 
        value: "$13,000 – $19,000", 
        notes: "Renewable. High academic achievement (top grades in WASSCE). Automatic consideration." 
      },
      { 
        name: "Tuition Award of Excellence", 
        value: "Reduces to Quebec rate", 
        notes: "Mostly for Ph.D. but some undergraduate merit awards exist." 
      }
    ],
    appFee: "$100 CAD",
    tuition: "$30,830 – $40,650 CAD",
    roomBoard: "$12,000 – $19,600 CAD",
    insights: "The \"Budget-Friendly\" English Option:\n• Cost: Tuition and living costs in Montreal are generally lower than Toronto or Vancouver.\n\n• Language: Concordia is an English-speaking university. You do not need French to study here, though learning basic French helps for daily life in Montreal.\n\n• Visa: Quebec has an extra immigration step called the CAQ. It takes 4-6 weeks longer than other provinces. Apply immediately after getting your offer.\n\n• Housing: The \"Grey Nuns\" residence is a beautiful historic building in downtown Montreal and a student favorite."
  },
  {
    id: "umontreal",
    name: "Univ. of Montreal",
    location: "Montreal, Quebec",
    deadline: "Feb 1, 2026",
    scholarships: [
      { 
        name: "UdeM Exemption Level A", 
        value: "~$13,740 off/year", 
        notes: "Top 5-10% grades. Reduces tuition to ~$13,560/yr." 
      },
      { 
        name: "UdeM Exemption Level B", 
        value: "~$6,548 off/year", 
        notes: "Top 20-30% grades." 
      }
    ],
    appFee: "~$112.25 CAD",
    tuition: "$27,300 – $31,200 (Before Scholarship)",
    roomBoard: "$4,000 – $8,000 CAD (Very Low)",
    insights: "The Language Trap:\n• Warning: 95% of undergraduate programs (Nursing, Engineering, Business, Science) are taught strictly in French. You must have B2/C1 French proficiency (TFI/TCF test) to apply.\n\n• English Options: The only major undergraduate program in English is \"English Studies\".\n\n• The \"Budget\" Hack: If you do speak French, this is the cheapest option on your list. Rent is ~$460/month vs $1,500+ in Toronto."
  },
  {
    id: "queens",
    name: "Queen's University",
    location: "Kingston, Ontario",
    deadline: "Dec 8, 2025 (Major Awards)",
    scholarships: [
      { 
        name: "Major Admission Awards (MAA)", 
        value: "$40,000 – $100,000+", 
        notes: "Superior academics (90%+), leadership. Requires separate app by Dec 8." 
      },
      { 
        name: "Intl. Admission Awards", 
        value: "$40,000 – $100,000", 
        notes: "Automatic consideration based on grades + Supplementary Essay." 
      },
      { 
        name: "Principal's Scholarship", 
        value: "$4,000 – $6,000", 
        notes: "Automatic (Top 5% of admission average)." 
      }
    ],
    appFee: "~$180 – $256 CAD",
    tuition: "$55,000 – $72,000 CAD",
    roomBoard: "$17,044 – $19,493 CAD",
    insights: "The \"Prestige\" Alternative to U of T:\n• Location: Kingston is a smaller, student-focused city, safer and quieter than Toronto.\n\n• Action: If you have strong grades (A1s), you must apply by Dec 8 for the Major Admission Awards. This is your only chance for significant funding ($40k+).\n\n• Essays: Queen's is famous for its \"Supplementary Essays\" (SE). Start these in November. They value unique personal stories over just listing achievements.\n\n• WASSCE: B3 in English is generally accepted for language proficiency."
  },
  {
    id: "upei",
    name: "Univ. of Prince Edward Island",
    location: "Charlottetown, PEI",
    deadline: "Feb 1 (Fall)",
    scholarships: [
      {
        name: "International Entrance Awards",
        value: "$1,000 – $3,000",
        notes: "Automatic consideration. 90%+ average."
      }
    ],
    appFee: "$50.40 CAD",
    tuition: "~$14,020 CAD/year",
    roomBoard: "~$10,000 – $12,000 CAD",
    insights: "Budget-Friendly Gem:\n• One of the most affordable universities in Canada ($14k tuition).\n• Small class sizes and a tight-knit community.\n• IELTS: 6.5 (no band <6)."
  },
  {
    id: "smu",
    name: "Saint Mary's University",
    location: "Halifax, Nova Scotia",
    deadline: "Feb 15 (Scholarships)",
    scholarships: [
      {
        name: "Presidential Scholarship",
        value: "$9,000/year (Renewable)",
        notes: "Requires 95%+ average or IB 36+."
      },
      {
        name: "Entrance Scholarships",
        value: "$1,000 – $3,500/year",
        notes: "Automatic consideration based on admission average."
      }
    ],
    appFee: "$86.40 CAD",
    tuition: "~$14,234 CAD",
    roomBoard: "~$12,000 – $15,000 CAD",
    insights: "Business & Science Focus:\n• Known for its Sobey School of Business.\n• Located in Halifax, a vibrant student city.\n• IELTS: 6.5 (no band <6). WAEC: C6 or higher."
  },
  {
    id: "tru",
    name: "Thompson Rivers University",
    location: "Kamloops, BC",
    deadline: "Jan 15 (Fall) / Sep 1 (Winter)",
    scholarships: [
      {
        name: "Academic Excellence Award",
        value: "Up to $2,000",
        notes: "Min GPA 86%. Automatic consideration."
      },
      {
        name: "Exceptional Student Award",
        value: "Up to $4,000",
        notes: "Min GPA 80% + IELTS 6.5. Automatic."
      }
    ],
    appFee: "$100 CAD",
    tuition: "~$18,000 – $22,000 CAD",
    roomBoard: "~$10,000 – $12,000 CAD",
    insights: "Flexible Learning:\n• Offers open learning and on-campus options.\n• Located in the interior of BC, offering a different climate than Vancouver.\n• Good option for students looking for a mix of academic and vocational programs."
  },
  {
    id: "crandall",
    name: "Crandall University",
    location: "Moncton, New Brunswick",
    deadline: "May 15 (Fall) / Nov 30 (Early)",
    scholarships: [
      {
        name: "William Carey Global Scholarship",
        value: "Up to $18,000/year",
        notes: "Renewable. Must live on campus. Faith-based criteria."
      },
      {
        name: "Jackson Entrance Scholarship",
        value: "$1,000",
        notes: "For incoming undergraduate students."
      }
    ],
    appFee: "$100 CAD",
    tuition: "~$16,775 – $24,950 CAD",
    roomBoard: "~$10,000 CAD",
    insights: "Faith-Based Education:\n• Christian liberal arts university.\n• Very generous William Carey Scholarship ($18k/yr) if you qualify.\n• Small community in Moncton."
  },
  {
    id: "stpaul",
    name: "Saint Paul University",
    location: "Ottawa, Ontario",
    deadline: "Apr 15 (Fall)",
    scholarships: [
      {
        name: "Automatic Admission Scholarship",
        value: "$500 – $3,000",
        notes: "Automatic if admission average is 80%+."
      }
    ],
    appFee: "$165 CAD",
    tuition: "~$19,955 – $29,965 CAD",
    roomBoard: "~$12,000 CAD",
    insights: "Bilingual Advantage:\n• Federated with University of Ottawa.\n• Strong focus on social sciences and humanities.\n• 'Study in French' scholarship can significantly reduce tuition."
  },
  {
    id: "royalroads",
    name: "Royal Roads University",
    location: "Colwood, BC",
    deadline: "May 15 (Fall)",
    scholarships: [
      {
        name: "Entrance Awards",
        value: "$2,000 – $10,000",
        notes: "Based on academic performance and leadership."
      }
    ],
    appFee: "~$134 CAD",
    tuition: "~$23,000 – $41,580 CAD",
    roomBoard: "~$12,000 – $15,000 CAD",
    insights: "Career-Focused:\n• Known for blended learning models and professional programs.\n• Beautiful campus (Hatley Castle).\n• Great for students with some work experience."
  },
  {
    id: "ucanwest",
    name: "University Canada West",
    location: "Vancouver, BC",
    deadline: "Aug 18 (Fall)",
    scholarships: [
      {
        name: "Entrance Scholarship",
        value: "Up to $20,000",
        notes: "For undergraduate degrees. Based on merit."
      },
      {
        name: "MBA Foundation Grant",
        value: "$6,500",
        notes: "Tuition credit for MBA Foundation courses."
      }
    ],
    appFee: "$150 CAD",
    tuition: "~$20,880 CAD (UG) / ~$35,100 (MBA)",
    roomBoard: "~$15,000+ CAD (Vancouver is expensive)",
    insights: "Business Oriented:\n• Strong focus on business and technology programs.\n• Located in downtown Vancouver.\n• 4 intakes per year (Fall, Winter, Spring, Summer) offers flexibility."
  },
  {
    id: "uregina",
    name: "University of Regina",
    location: "Regina, Saskatchewan",
    deadline: "Aug 15 (Fall)",
    scholarships: [
      {
        name: "International Entrance Scholarship",
        value: "$3,000 or Housing Credit",
        notes: "Automatic consideration with 85%+ average."
      },
      {
        name: "Circle of Scholars",
        value: "$5,000/year (x4)",
        notes: "Top academic performance."
      }
    ],
    appFee: "$100 CAD",
    tuition: "~$22,000 CAD",
    roomBoard: "~$10,000 CAD (Affordable)",
    insights: "Prairie Value:\n• Very affordable cost of living in Regina.\n• 'Really BIG Deal' bundle can save significantly on total costs.\n• Strong co-op programs."
  },
  {
    id: "mta",
    name: "Mount Allison University",
    location: "Sackville, New Brunswick",
    deadline: "Mar 1 (Scholarships)",
    scholarships: [
      {
        name: "Entrance Scholarships",
        value: "$4,000 – $20,000",
        notes: "Automatic consideration if applied by Mar 1. 80%+ avg."
      }
    ],
    appFee: "$125 CAD",
    tuition: "~$21,800 CAD",
    roomBoard: "~$11,000 CAD",
    insights: "Top Undergraduate School:\n• Consistently ranked #1 primarily undergraduate university in Canada.\n• Small classes, personalized attention.\n• Beautiful campus in a small town."
  },
  {
    id: "vcc",
    name: "Vancouver Community College",
    location: "Vancouver, BC",
    deadline: "Program Specific (Apply Early)",
    scholarships: [
      {
        name: "Regional Entrance Award",
        value: "$500 – $5,000",
        notes: "For underrepresented regions. First-come, first-served."
      }
    ],
    appFee: "$145 CAD",
    tuition: "Varies (Diploma/Cert focused)",
    roomBoard: "~$15,000+ CAD",
    insights: "Vocational & Trades:\n• Excellent for culinary, hospitality, design, and trades.\n• High employment rate for graduates.\n• Located in the heart of Vancouver."
  },
  {
    id: "stlawrence",
    name: "St. Lawrence College",
    location: "Kingston/Brockville/Cornwall, ON",
    deadline: "Feb 1 (Recommended)",
    scholarships: [
      {
        name: "Academic Merit Scholarship",
        value: "$500 – $4,000",
        notes: "Based on grades (80%+ for max award)."
      }
    ],
    appFee: "$100 CAD",
    tuition: "~$16,672 – $21,500 CAD",
    roomBoard: "~$11,000 CAD",
    insights: "Community College Experience:\n• Practical, hands-on learning.\n• Three campuses in Eastern Ontario.\n• Good pathways to university or direct employment."
  },
  {
    id: "lakeland",
    name: "Lakeland College",
    location: "Vermilion/Lloydminster, Alberta",
    deadline: "Jun 1 (Fall)",
    scholarships: [
      {
        name: "Bursaries",
        value: "Varies",
        notes: "Based on financial need and academic success."
      }
    ],
    appFee: "$90 CAD",
    tuition: "~$17,700 CAD",
    roomBoard: "~$10,000 CAD",
    insights: "Hands-On Learning:\n• Strong agricultural and environmental sciences programs.\n• 'Student-Managed Farm' is a unique learning model.\n• Small class sizes."
  },
  {
    id: "brandon",
    name: "Brandon University",
    location: "Brandon, Manitoba",
    deadline: "Apr 1",
    scholarships: [],
    appFee: "$115.20 CAD",
    tuition: "~$17,090 CAD",
    roomBoard: "Affordable",
    insights: "Manitoba Value:\n• IELTS: 6.5 (min 6.0 each).\n• WAEC: C5 or higher (5 subjects)."
  },
  {
    id: "unb",
    name: "Univ. of New Brunswick",
    location: "Fredericton/Saint John, NB",
    deadline: "Feb 15",
    scholarships: [],
    appFee: "$104.40 CAD",
    tuition: "~$18,720 CAD",
    roomBoard: "Moderate",
    insights: "Oldest English University:\n• IELTS: 6.5 overall.\n• Accepts SAT/ACT/CXC."
  },
  {
    id: "mun",
    name: "Memorial Univ. of Newfoundland",
    location: "St. John's, NL",
    deadline: "Mar 1",
    scholarships: [],
    appFee: "$230.40 CAD",
    tuition: "~$21,352 CAD",
    roomBoard: "Affordable",
    insights: "Atlantic Edge:\n• IELTS: 6.5 (min 6.0 R&W).\n• Unique culture and history."
  },
  {
    id: "uwinnipeg",
    name: "Univ. of Winnipeg",
    location: "Winnipeg, Manitoba",
    deadline: "Mar 1",
    scholarships: [],
    appFee: "$100.80 CAD",
    tuition: "~$17,081 CAD",
    roomBoard: "Affordable",
    insights: "Urban Campus:\n• IELTS: Not required (check policy).\n• WAEC: 5 passes, avg B (B3)."
  },
  {
    id: "cmu",
    name: "Canadian Mennonite Univ.",
    location: "Winnipeg, Manitoba",
    deadline: "Feb 28",
    scholarships: [],
    appFee: "$122.40 CAD",
    tuition: "~$14,946 CAD",
    roomBoard: "Affordable",
    insights: "Faith & Community:\n• IELTS: 6.5 (min 6.0 each).\n• WAEC: B3+ and 4x C4+."
  },
  {
    id: "dalhousie",
    name: "Dalhousie University",
    location: "Halifax, Nova Scotia",
    deadline: "Feb 15",
    scholarships: [],
    appFee: "$97.20 CAD",
    tuition: "~$17,793 CAD",
    roomBoard: "Moderate",
    insights: "Research Powerhouse:\n• Largest university in Atlantic Canada.\n• IELTS: Varies by program."
  },
  {
    id: "cbu",
    name: "Cape Breton University",
    location: "Sydney, Nova Scotia",
    deadline: "Feb 15",
    scholarships: [],
    appFee: "$72.00 CAD",
    tuition: "~$17,585 CAD",
    roomBoard: "Affordable",
    insights: "Island Life:\n• Growing international student population.\n• IELTS: Varies by program."
  }
];
