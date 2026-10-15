/* Original MOVA concept catalog. All inventory and prices are demo data. */
window.MOVA_CATALOG = Object.freeze({
  "brand": {
    "name": "MOVA",
    "url": window.location?.origin || "",
    "contactInternational": "972544513141",
    "defaultLanguage": "he"
  },
  "products": [
    {
      "id": "move",
      "code": "MOVE 01",
      "category": "footwear",
      "price": 490,
      "image": "assets/sneaker.webp",
      "surface": "#e8eadd",
      "badge": "STUDIO EDIT",
      "title": {
        "he": "סניקרס בקצב שלך",
        "en": "Your everyday, elevated",
        "ar": "خطوات بإيقاعك"
      },
      "description": {
        "he": "סריג בצבע קרם, קווים פיסוליים ונגיעה של כתום. נעל קונספט שמחברת בין הצורה, הטקסטורה והאנרגיה של היום שלך.",
        "en": "Cream knit, sculptural lines, a flash of orange. A concept sneaker that brings shape, texture and everyday energy together.",
        "ar": "نسيج كريمي، خطوط منحوتة ولمسة برتقالية. حذاء مفهوم يجمع الشكل والملمس وطاقة يومك."
      },
      "details": {
        "he": "עיצוב קונספט בסריג מרובד, פאנלים בגוון טרקוטה וסוליה פיסולית. התמונות נוצרו במיוחד להדגמת החנות; זה אינו מוצר למכירה.",
        "en": "A layered knit concept, terracotta panels and a sculptural sole. Images were created for this storefront demonstration; this is not a product for sale.",
        "ar": "تصميم مفهوم بنسيج متعدد الطبقات وألواح بلون الطين ونعل منحوت. الصور صُمّمت لهذا العرض؛ المنتج غير معروض للبيع."
      },
      "colors": [
        {
          "id": "orange",
          "hex": "#c66730",
          "filter": "none",
          "label": {
            "he": "קרם / כתום",
            "en": "Cream / orange",
            "ar": "كريمي / برتقالي"
          }
        },
        {
          "id": "mint",
          "hex": "#547d65",
          "filter": "hue-rotate(125deg) saturate(.55)",
          "label": {
            "he": "קרם / ירוק",
            "en": "Cream / green",
            "ar": "كريمي / أخضر"
          }
        }
      ],
      "sizes": [
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45"
      ],
      "defaultSize": "40",
      "material": {
        "he": "סריג / פאנלים מפוסלים",
        "en": "Knit / sculpted panels",
        "ar": "نسيج / ألواح منحوتة"
      },
      "new": false,
      "featured": 0,
      "inventory": {
        "orange": {
          "36": 3,
          "37": 4,
          "38": 5,
          "39": 6,
          "40": 7,
          "41": 8,
          "42": 9,
          "43": 10,
          "44": 3,
          "45": 0
        },
        "mint": {
          "36": 4,
          "37": 5,
          "38": 6,
          "39": 7,
          "40": 8,
          "41": 9,
          "42": 10,
          "43": 3,
          "44": 4,
          "45": 0
        }
      },
      "components": [
        {
          "id": "upper",
          "label": {
            "he": "מעטפת הסריג",
            "en": "Knit upper",
            "ar": "النسيج العلوي"
          },
          "material": {
            "he": "סריג טקסטורלי בגוון קרם",
            "en": "Textured cream knit",
            "ar": "نسيج كريمي بارز"
          },
          "detail": {
            "he": "האריגה הפתוחה יוצרת את פני השטח בחזית ובצדי הנעל.",
            "en": "The open weave forms the surface across the toe and sides.",
            "ar": "النسيج المفتوح يشكّل سطح مقدمة الحذاء وجوانبه."
          },
          "focus": {
            "x": 0.42,
            "y": 0.53,
            "scale": 3.5
          }
        },
        {
          "id": "panels",
          "label": {
            "he": "פאנלי הצד",
            "en": "Side panels",
            "ar": "الألواح الجانبية"
          },
          "material": {
            "he": "גימור דמוי זמש ועור",
            "en": "Suede- and leather-look finish",
            "ar": "تشطيب بمظهر الشامواه والجلد"
          },
          "detail": {
            "he": "שכבות כתומות ובהירות עוקבות אחר הקימורים ומקיפות את הסריג.",
            "en": "Orange and cream overlays trace the curves and frame the knit.",
            "ar": "طبقات برتقالية وكريمية تتبع الانحناءات وتحيط بالنسيج."
          },
          "focus": {
            "x": 0.7,
            "y": 0.48,
            "scale": 3.5
          }
        },
        {
          "id": "laces",
          "label": {
            "he": "שרוכים ועיניות",
            "en": "Laces & loops",
            "ar": "الأربطة والحلقات"
          },
          "material": {
            "he": "שרוך ארוג ולולאות כהות",
            "en": "Woven laces and dark loops",
            "ar": "أربطة منسوجة وحلقات داكنة"
          },
          "detail": {
            "he": "שרוכים בהירים עוברים בלולאות לאורך הלשונית המרכזית.",
            "en": "Cream laces pass through dark loops along the central tongue.",
            "ar": "أربطة فاتحة تمر عبر حلقات داكنة بمحاذاة اللسان الأوسط."
          },
          "focus": {
            "x": 0.49,
            "y": 0.41,
            "scale": 3.5
          }
        },
        {
          "id": "lining",
          "label": {
            "he": "מדרס ובטנה",
            "en": "Insole & lining",
            "ar": "الفرشة والبطانة"
          },
          "material": {
            "he": "בד פנימי ושכבת קצף להמחשה",
            "en": "Concept fabric lining and foam layer",
            "ar": "بطانة قماش وطبقة رغوية توضيحية"
          },
          "detail": {
            "he": "הבטנה נראית בפתח. המדרס והמבנה הפנימי מוצגים כשכבות קונספט במעבדת התלת־ממד.",
            "en": "The lining is visible at the collar. The insole and internal construction are concept layers in the 3D lab.",
            "ar": "تظهر البطانة عند الفتحة. الفرشة والبنية الداخلية طبقات توضيحية في مختبر 3D."
          },
          "focus": {
            "x": 0.76,
            "y": 0.35,
            "scale": 3.5
          }
        },
        {
          "id": "midsole",
          "label": {
            "he": "סוליית הביניים",
            "en": "Sculpted midsole",
            "ar": "النعل الأوسط"
          },
          "material": {
            "he": "גימור קצף מפוסל",
            "en": "Sculpted foam finish",
            "ar": "تشطيب رغوي منحوت"
          },
          "detail": {
            "he": "תעלות, קשתות ותוספת כתומה בעקב יוצרים את הצורה העבה של הסוליה.",
            "en": "Channels, arches and an orange heel insert define the chunky sole.",
            "ar": "أخاديد وأقواس وإضافة برتقالية عند الكعب تحدد شكل النعل السميك."
          },
          "focus": {
            "x": 0.62,
            "y": 0.69,
            "scale": 3.5
          }
        },
        {
          "id": "outsole",
          "label": {
            "he": "הבסיס החיצוני",
            "en": "Outer sole",
            "ar": "النعل الخارجي"
          },
          "material": {
            "he": "גימור דמוי גומי כהה",
            "en": "Dark rubber-look finish",
            "ar": "تشطيب بمظهر المطاط الداكن"
          },
          "detail": {
            "he": "המקטעים הכהים והחריצים מסיימים את החלק התחתון והקדמי של הנעל.",
            "en": "Dark segments and grooves finish the underside and toe edge.",
            "ar": "مقاطع داكنة وأخاديد تحدد قاعدة الحذاء وحافة مقدمته."
          },
          "focus": {
            "x": 0.25,
            "y": 0.73,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/move.webp",
      "spin": {
        "src": "assets/spin/move.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            366,
            723,
            1085,
            1448
          ],
          "y": [
            0,
            368,
            726,
            1086
          ]
        },
        "framing": [
          {
            "cx": 184,
            "cy": 202.5,
            "scale": 0.75329
          },
          {
            "cx": 179.5,
            "cy": 202.5,
            "scale": 0.75329
          },
          {
            "cx": 180.5,
            "cy": 204.5,
            "scale": 0.76453
          },
          {
            "cx": 180.5,
            "cy": 192,
            "scale": 0.93559
          },
          {
            "cx": 187,
            "cy": 187.5,
            "scale": 0.75887
          },
          {
            "cx": 182,
            "cy": 183.5,
            "scale": 0.73703
          },
          {
            "cx": 171.5,
            "cy": 182.5,
            "scale": 0.74237
          },
          {
            "cx": 183,
            "cy": 184.5,
            "scale": 0.73703
          },
          {
            "cx": 183,
            "cy": 179.5,
            "scale": 0.82619
          },
          {
            "cx": 178.5,
            "cy": 183,
            "scale": 0.93559
          },
          {
            "cx": 182.5,
            "cy": 193,
            "scale": 0.80986
          },
          {
            "cx": 181,
            "cy": 188,
            "scale": 0.77907
          }
        ]
      }
    },
    {
      "id": "focus",
      "code": "FOCUS 02",
      "category": "audio",
      "price": 690,
      "image": "assets/headphones.webp",
      "surface": "#eee5d9",
      "badge": "THE QUIET EDIT",
      "title": {
        "he": "השקט נראה טוב עליך",
        "en": "A little space for yourself",
        "ar": "مساحة من الهدوء لك"
      },
      "description": {
        "he": "קימורים רכים, גימור שנהב ונגיעת מתכת חמה. אוזניות קונספט שמעבירות גם את השקט לצד של הסטייל.",
        "en": "Soft curves, an ivory finish and warm metal. Concept headphones that bring a little style to your quiet moments.",
        "ar": "منحنيات ناعمة، لون عاجي ولمسة معدن دافئة. سماعات مفهوم تمنح لحظات الهدوء أسلوباً خاصاً."
      },
      "details": {
        "he": "גימור שנהב, כריות במראה רך ואוזניות בגוון מתכתי חם. זהו עיצוב קונספט; אין כאן מפרט שמע, סוללה או הבטחת ביצועים.",
        "en": "Ivory finish, soft-looking cushions and warm metal earcups. This is a design concept with no audio, battery or performance claims.",
        "ar": "لمسة عاجية ووسائد ناعمة المظهر وكؤوس معدنية دافئة. هذا مفهوم تصميم بلا مواصفات صوت أو بطارية أو وعود أداء."
      },
      "colors": [
        {
          "id": "peach",
          "hex": "#cd956d",
          "filter": "none",
          "label": {
            "he": "שנהב / אפרסק",
            "en": "Ivory / peach",
            "ar": "عاجي / خوخي"
          }
        },
        {
          "id": "sage",
          "hex": "#64826e",
          "filter": "hue-rotate(125deg) saturate(.4)",
          "label": {
            "he": "שנהב / מרווה",
            "en": "Ivory / sage",
            "ar": "عاجي / أخضر هادئ"
          }
        }
      ],
      "sizes": [
        "ONE SIZE"
      ],
      "defaultSize": "ONE SIZE",
      "material": {
        "he": "קשת מרופדת / גימור מט",
        "en": "Padded band / matte finish",
        "ar": "طوق مبطن / تشطيب مطفي"
      },
      "new": false,
      "featured": 1,
      "inventory": {
        "peach": {
          "ONE SIZE": 4
        },
        "sage": {
          "ONE SIZE": 5
        }
      },
      "components": [
        {
          "id": "headband",
          "label": {
            "he": "קשת הראש",
            "en": "Headband",
            "ar": "طوق الرأس"
          },
          "material": {
            "he": "קשת בגימור מט וריפוד בהיר",
            "en": "Matte band with pale padding",
            "ar": "طوق مطفي مع تبطين فاتح"
          },
          "detail": {
            "he": "הקשת המעוגלת מחברת בין שתי האוזניות, עם שכבה מרופדת בצדה הפנימי.",
            "en": "The curved band joins the two earcups with padding on its inner face.",
            "ar": "الطوق المنحني يربط الكأسين مع تبطين على جانبه الداخلي."
          },
          "focus": {
            "x": 0.49,
            "y": 0.25,
            "scale": 3.5
          }
        },
        {
          "id": "cups",
          "label": {
            "he": "מעטפת האוזניות",
            "en": "Earcup shells",
            "ar": "غلاف الكأسين"
          },
          "material": {
            "he": "גימור מתכתי בגוון אפרסק",
            "en": "Peach metallic-look finish",
            "ar": "تشطيب بمظهر معدني خوخي"
          },
          "detail": {
            "he": "שתי מעטפות מעוגלות יוצרות את הצורה הפיסולית של האוזניות.",
            "en": "Two rounded shells create the headphones’ sculptural form.",
            "ar": "غلافان مستديران يشكّلان التصميم المنحوت للسماعات."
          },
          "focus": {
            "x": 0.66,
            "y": 0.58,
            "scale": 3.5
          }
        },
        {
          "id": "cushions",
          "label": {
            "he": "כריות האוזניים",
            "en": "Ear cushions",
            "ar": "وسائد الأذن"
          },
          "material": {
            "he": "ריפוד בגימור דמוי עור",
            "en": "Leather-look padded finish",
            "ar": "تبطين بمظهر جلدي"
          },
          "detail": {
            "he": "כריות בהירות מקיפות את הפתח הפנימי של כל אוזנייה.",
            "en": "Pale cushions surround the inner opening of each earcup.",
            "ar": "وسائد فاتحة تحيط بالفتحة الداخلية لكل كأس."
          },
          "focus": {
            "x": 0.37,
            "y": 0.63,
            "scale": 3.5
          }
        },
        {
          "id": "joints",
          "label": {
            "he": "מחברים צדדיים",
            "en": "Side joints",
            "ar": "المفاصل الجانبية"
          },
          "material": {
            "he": "מחברי קשת בגימור תואם",
            "en": "Matching headband connectors",
            "ar": "وصلات طوق بتشطيب متناسق"
          },
          "detail": {
            "he": "נקודות החיבור מקשרות בין הקשת למעטפות. מנגנון פנימי אינו מפרט טכני מאומת.",
            "en": "The joints connect the band to the shells. Internal mechanisms are not verified specifications.",
            "ar": "المفاصل تصل الطوق بالغلافين. الآليات الداخلية ليست مواصفات مؤكدة."
          },
          "focus": {
            "x": 0.68,
            "y": 0.43,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/focus.webp",
      "spin": {
        "src": "assets/spin/focus.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            372,
            717,
            1087,
            1448
          ],
          "y": [
            0,
            364,
            716,
            1086
          ]
        },
        "framing": [
          {
            "cx": 199.5,
            "cy": 187,
            "scale": 0.91057
          },
          {
            "cx": 177,
            "cy": 187,
            "scale": 0.91057
          },
          {
            "cx": 186,
            "cy": 187.5,
            "scale": 0.90786
          },
          {
            "cx": 179.5,
            "cy": 186.5,
            "scale": 0.90786
          },
          {
            "cx": 186.5,
            "cy": 175.5,
            "scale": 0.90786
          },
          {
            "cx": 170.5,
            "cy": 174.5,
            "scale": 0.91329
          },
          {
            "cx": 184,
            "cy": 172,
            "scale": 0.92717
          },
          {
            "cx": 177,
            "cy": 175,
            "scale": 0.91057
          },
          {
            "cx": 185.5,
            "cy": 178,
            "scale": 0.90516
          },
          {
            "cx": 164,
            "cy": 179,
            "scale": 0.91604
          },
          {
            "cx": 182,
            "cy": 179,
            "scale": 0.91604
          },
          {
            "cx": 178.5,
            "cy": 179,
            "scale": 0.92157
          }
        ]
      }
    },
    {
      "id": "carry",
      "code": "GO 03",
      "category": "bags",
      "price": 290,
      "image": "assets/bag.webp",
      "surface": "#f1dfd4",
      "badge": "TAKE IT WITH YOU",
      "title": {
        "he": "כל היום, בתיק אחד",
        "en": "Take your day with you",
        "ar": "خذ يومك معك"
      },
      "description": {
        "he": "צורה נקייה, גוון טרקוטה עמוק וטקסטורה עם אופי. תיק קונספט לימים שלא נשארים במקום.",
        "en": "A clean silhouette, deep terracotta and a texture with character. A concept backpack for days that keep moving.",
        "ar": "شكل واضح، لون طيني عميق وملمس له شخصيته. حقيبة مفهوم للأيام التي لا تتوقف."
      },
      "details": {
        "he": "אריג במראה טכני, חזית מעוגלת, ידית עליונה ומשיכת רוכסן בהירה. מוצר קונספט ללא נתוני נפח או הבטחת עמידות.",
        "en": "Technical-looking canvas, a rounded front, top handle and a light zipper pull. A concept product without capacity or durability claims.",
        "ar": "نسيج تقني المظهر، واجهة مستديرة، مقبض علوي وسحّاب فاتح. منتج مفهوم بلا ادّعاءات سعة أو متانة."
      },
      "colors": [
        {
          "id": "terracotta",
          "hex": "#b45e37",
          "filter": "none",
          "label": {
            "he": "טרקוטה",
            "en": "Terracotta",
            "ar": "طيني"
          }
        },
        {
          "id": "olive",
          "hex": "#8a8348",
          "filter": "hue-rotate(40deg) saturate(.5)",
          "label": {
            "he": "זית",
            "en": "Olive",
            "ar": "زيتوني"
          }
        }
      ],
      "sizes": [
        "ONE SIZE"
      ],
      "defaultSize": "ONE SIZE",
      "material": {
        "he": "אריג טקסטורלי / רצועות נשיאה",
        "en": "Textured weave / carry straps",
        "ar": "نسيج بارز / أحزمة حمل"
      },
      "new": false,
      "featured": 2,
      "inventory": {
        "terracotta": {
          "ONE SIZE": 5
        },
        "olive": {
          "ONE SIZE": 6
        }
      },
      "components": [
        {
          "id": "body",
          "label": {
            "he": "גוף התיק",
            "en": "Main body",
            "ar": "جسم الحقيبة"
          },
          "material": {
            "he": "אריג טכני במראה קנבס",
            "en": "Technical canvas-look weave",
            "ar": "نسيج تقني بمظهر الكانفاس"
          },
          "detail": {
            "he": "הבד בגוון טרקוטה מעצב את התא המרכזי ואת הדפנות המעוגלות.",
            "en": "Terracotta fabric shapes the main compartment and rounded sides.",
            "ar": "القماش الطيني يشكّل الحجرة الرئيسية والجوانب المستديرة."
          },
          "focus": {
            "x": 0.49,
            "y": 0.49,
            "scale": 3.5
          }
        },
        {
          "id": "front",
          "label": {
            "he": "הכיס הקדמי",
            "en": "Front pocket",
            "ar": "الجيب الأمامي"
          },
          "material": {
            "he": "פאנל בד מובנה",
            "en": "Structured fabric panel",
            "ar": "لوح قماشي محدد الشكل"
          },
          "detail": {
            "he": "כיס בולט בחזית מוסיף שכבה נפרדת לצורה המרכזית.",
            "en": "A raised front pocket adds a separate layer to the main shape.",
            "ar": "جيب بارز في الواجهة يضيف طبقة مستقلة إلى الشكل الرئيسي."
          },
          "focus": {
            "x": 0.49,
            "y": 0.65,
            "scale": 3.5
          }
        },
        {
          "id": "zip",
          "label": {
            "he": "סגירה ורוכסנים",
            "en": "Closures & zips",
            "ar": "الإغلاق والسحابات"
          },
          "material": {
            "he": "רוכסן ומשיכות בגוון שנהב",
            "en": "Zip with ivory pulls",
            "ar": "سحاب مع سحّابات عاجية"
          },
          "detail": {
            "he": "קווי הרוכסן מגדירים את פתחי הגישה לתאים.",
            "en": "Zip lines outline the openings to the compartments.",
            "ar": "خطوط السحاب تحدد فتحات الوصول إلى الحجرات."
          },
          "focus": {
            "x": 0.57,
            "y": 0.4,
            "scale": 3.5
          }
        },
        {
          "id": "straps",
          "label": {
            "he": "רצועות הכתפיים",
            "en": "Shoulder straps",
            "ar": "أحزمة الكتف"
          },
          "material": {
            "he": "רצועות בד עם אזורי ריפוד",
            "en": "Fabric straps with padded areas",
            "ar": "أحزمة قماش بمناطق مبطنة"
          },
          "detail": {
            "he": "שתי רצועות מאחור ממשיכות את השפה הצבעונית של גוף התיק.",
            "en": "Two rear straps continue the color language of the bag.",
            "ar": "حزامان خلفيان يكملان ألوان جسم الحقيبة."
          },
          "focus": {
            "x": 0.73,
            "y": 0.48,
            "scale": 3.5
          }
        },
        {
          "id": "handle",
          "label": {
            "he": "ידית נשיאה",
            "en": "Carry handle",
            "ar": "مقبض الحمل"
          },
          "material": {
            "he": "לולאת אריג מחוזקת בתפירה",
            "en": "Stitched woven loop",
            "ar": "حلقة منسوجة بخياطة داعمة"
          },
          "detail": {
            "he": "לולאה קצרה מחוברת לחלק העליון ומשלימה את אזור הפתח.",
            "en": "A short loop attaches at the top and frames the opening.",
            "ar": "حلقة قصيرة متصلة بالأعلى تكمل منطقة الفتحة."
          },
          "focus": {
            "x": 0.48,
            "y": 0.21,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/carry.webp",
      "spin": {
        "src": "assets/spin/carry.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            358,
            728,
            1098,
            1448
          ],
          "y": [
            0,
            362,
            720,
            1086
          ]
        },
        "framing": [
          {
            "cx": 183.5,
            "cy": 182.5,
            "scale": 0.88713
          },
          {
            "cx": 203.5,
            "cy": 184,
            "scale": 0.87942
          },
          {
            "cx": 203,
            "cy": 184,
            "scale": 0.87942
          },
          {
            "cx": 186,
            "cy": 181.5,
            "scale": 0.88198
          },
          {
            "cx": 189,
            "cy": 178.5,
            "scale": 0.89235
          },
          {
            "cx": 188,
            "cy": 178,
            "scale": 0.88974
          },
          {
            "cx": 177.5,
            "cy": 176.5,
            "scale": 0.89235
          },
          {
            "cx": 160.5,
            "cy": 176,
            "scale": 0.89499
          },
          {
            "cx": 171.5,
            "cy": 177.5,
            "scale": 0.89763
          },
          {
            "cx": 175,
            "cy": 178.5,
            "scale": 0.89235
          },
          {
            "cx": 165.5,
            "cy": 179.5,
            "scale": 0.89763
          },
          {
            "cx": 159.5,
            "cy": 179,
            "scale": 0.89499
          }
        ]
      }
    },
    {
      "id": "pace",
      "code": "PACE 04",
      "category": "footwear",
      "price": 390,
      "compareAt": 490,
      "surface": "#e8eadd",
      "badge": "THE DAILY CLASSIC",
      "title": {
        "he": "סניקרס נקיות, יום פתוח",
        "en": "Clean lines. Open plans.",
        "ar": "خطوط هادئة، يوم مفتوح"
      },
      "description": {
        "he": "סילואט נמוך בקרם, פרט ירוק וסוליית גומי בגוון חם.",
        "en": "A low cream silhouette, a green accent and a warm gum sole.",
        "ar": "تصميم منخفض كريمي، لمسة خضراء ونعل بلون دافئ."
      },
      "colors": [
        {
          "id": "sand",
          "hex": "#d9c4a0",
          "filter": "none",
          "label": {
            "he": "חול",
            "en": "Sand",
            "ar": "رملي"
          }
        },
        {
          "id": "sage",
          "hex": "#72866d",
          "filter": "hue-rotate(55deg) saturate(.55)",
          "label": {
            "he": "מרווה",
            "en": "Sage",
            "ar": "مريمي"
          }
        },
        {
          "id": "charcoal",
          "hex": "#353d36",
          "filter": "saturate(.1) brightness(.62)",
          "label": {
            "he": "פחם",
            "en": "Charcoal",
            "ar": "فحمي"
          }
        }
      ],
      "sizes": [
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45"
      ],
      "defaultSize": "40",
      "material": {
        "he": "דמוי עור / סוליית גומי",
        "en": "Leather-look / gum sole",
        "ar": "مظهر جلدي / نعل مطاطي"
      },
      "image": "assets/pace.webp",
      "details": {
        "he": "עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.",
        "en": "An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.",
        "ar": "تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع."
      },
      "components": [
        {
          "id": "upper",
          "label": {
            "he": "המעטפת העליונה",
            "en": "Upper shell",
            "ar": "الغلاف العلوي"
          },
          "material": {
            "he": "גימור דמוי עור בגוון קרם",
            "en": "Cream leather-look finish",
            "ar": "تشطيب كريمي بمظهر جلدي"
          },
          "detail": {
            "he": "פאנלים חלקים ותפרי מתאר יוצרים סילואט נמוך ונקי.",
            "en": "Smooth panels and contour stitching create a clean low silhouette.",
            "ar": "ألواح ناعمة وخياطة محيطية تشكّل تصميماً منخفضاً ونقياً."
          },
          "focus": {
            "x": 0.45,
            "y": 0.56,
            "scale": 3.5
          }
        },
        {
          "id": "heel",
          "label": {
            "he": "טאב העקב",
            "en": "Heel tab",
            "ar": "لسان الكعب"
          },
          "material": {
            "he": "פאנל ירוק בעל טקסטורה",
            "en": "Textured green panel",
            "ar": "لوح أخضر بملمس بارز"
          },
          "detail": {
            "he": "הנגיעה הירוקה עוטפת את החלק האחורי של צוואר הנעל.",
            "en": "The green accent wraps around the rear of the collar.",
            "ar": "اللمسة الخضراء تلتف حول الجزء الخلفي من فتحة الحذاء."
          },
          "focus": {
            "x": 0.8,
            "y": 0.34,
            "scale": 3.5
          }
        },
        {
          "id": "laces",
          "label": {
            "he": "שרוכים ולשונית",
            "en": "Laces & tongue",
            "ar": "الأربطة واللسان"
          },
          "material": {
            "he": "שרוכים שטוחים ולשונית תואמת",
            "en": "Flat laces and matching tongue",
            "ar": "أربطة مسطحة ولسان متناسق"
          },
          "detail": {
            "he": "שורת השרוכים הבהירה מונחת מעל הלשונית המרכזית.",
            "en": "A row of cream laces sits over the central tongue.",
            "ar": "صف من الأربطة الفاتحة يستقر فوق اللسان الأوسط."
          },
          "focus": {
            "x": 0.49,
            "y": 0.43,
            "scale": 3.5
          }
        },
        {
          "id": "lining",
          "label": {
            "he": "הבטנה",
            "en": "Interior lining",
            "ar": "البطانة الداخلية"
          },
          "material": {
            "he": "גימור פנימי בגוון חול",
            "en": "Sand-colored inner finish",
            "ar": "تشطيب داخلي رملي"
          },
          "detail": {
            "he": "הבטנה הבהירה נראית בפתח העגול וממשיכה לתוך הנעל.",
            "en": "Pale lining is visible at the rounded opening and continues inside.",
            "ar": "تظهر البطانة الفاتحة عند الفتحة المستديرة وتمتد للداخل."
          },
          "focus": {
            "x": 0.76,
            "y": 0.37,
            "scale": 3.5
          }
        },
        {
          "id": "sole",
          "label": {
            "he": "סוליית הגומי",
            "en": "Gum-look sole",
            "ar": "النعل بمظهر المطاط"
          },
          "material": {
            "he": "גימור גומי חם עם תפר היקפי",
            "en": "Warm gum finish with perimeter stitching",
            "ar": "تشطيب مطاطي دافئ بخياطة محيطية"
          },
          "detail": {
            "he": "בסיס נמוך בגוון דבש ותפר רציף מקיפים את החלק התחתון.",
            "en": "A low honey-colored base and continuous stitching surround the bottom.",
            "ar": "قاعدة منخفضة بلون العسل وخياطة متصلة تحيط بأسفل الحذاء."
          },
          "focus": {
            "x": 0.49,
            "y": 0.72,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/pace.webp",
      "spin": {
        "src": "assets/spin/pace.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            382,
            730,
            1063,
            1448
          ],
          "y": [
            0,
            370,
            714,
            1086
          ]
        },
        "framing": [
          {
            "cx": 185,
            "cy": 207.5,
            "scale": 0.63671
          },
          {
            "cx": 164.5,
            "cy": 209.5,
            "scale": 0.62118
          },
          {
            "cx": 166,
            "cy": 214.5,
            "scale": 0.60639
          },
          {
            "cx": 189.5,
            "cy": 207,
            "scale": 0.94913
          },
          {
            "cx": 207,
            "cy": 182,
            "scale": 0.69776
          },
          {
            "cx": 178.5,
            "cy": 182.5,
            "scale": 0.65867
          },
          {
            "cx": 168,
            "cy": 181,
            "scale": 0.63937
          },
          {
            "cx": 186.5,
            "cy": 181.5,
            "scale": 0.65867
          },
          {
            "cx": 197.5,
            "cy": 162,
            "scale": 0.97331
          },
          {
            "cx": 171.5,
            "cy": 162.5,
            "scale": 0.62118
          },
          {
            "cx": 163,
            "cy": 162,
            "scale": 0.56388
          },
          {
            "cx": 182.5,
            "cy": 159.5,
            "scale": 0.57448
          }
        ]
      },
      "new": false,
      "featured": 3,
      "inventory": {
        "sand": {
          "36": 6,
          "37": 7,
          "38": 8,
          "39": 9,
          "40": 10,
          "41": 3,
          "42": 4,
          "43": 5,
          "44": 6,
          "45": 0
        },
        "sage": {
          "36": 7,
          "37": 8,
          "38": 9,
          "39": 10,
          "40": 3,
          "41": 4,
          "42": 5,
          "43": 6,
          "44": 7,
          "45": 0
        },
        "charcoal": {
          "36": 8,
          "37": 9,
          "38": 10,
          "39": 3,
          "40": 4,
          "41": 5,
          "42": 6,
          "43": 7,
          "44": 8,
          "45": 0
        }
      }
    },
    {
      "id": "slide",
      "code": "SLIDE 05",
      "category": "footwear",
      "price": 190,
      "compareAt": null,
      "surface": "#f1dfd4",
      "badge": "OFF DUTY",
      "title": {
        "he": "לתת ליום לזרום",
        "en": "Make room for slow days",
        "ar": "مساحة لأيام هادئة"
      },
      "description": {
        "he": "כפכף פיסולי עם רצועה רחבה, קווים רכים וגוון טרקוטה.",
        "en": "A sculpted slide with a broad strap, soft lines and a terracotta finish.",
        "ar": "صندل منحوت بحزام عريض وخطوط ناعمة بلون طيني."
      },
      "colors": [
        {
          "id": "clay",
          "hex": "#bf6846",
          "filter": "none",
          "label": {
            "he": "טרקוטה",
            "en": "Terracotta",
            "ar": "طيني"
          }
        },
        {
          "id": "cream",
          "hex": "#e8dfca",
          "filter": "saturate(.15) brightness(1.08)",
          "label": {
            "he": "אבן",
            "en": "Stone",
            "ar": "حجري"
          }
        },
        {
          "id": "sage",
          "hex": "#72866d",
          "filter": "hue-rotate(55deg) saturate(.55)",
          "label": {
            "he": "מרווה",
            "en": "Sage",
            "ar": "مريمي"
          }
        }
      ],
      "sizes": [
        "36–37",
        "38–39",
        "40–41",
        "42–43",
        "44–45"
      ],
      "defaultSize": "40–41",
      "material": {
        "he": "מבנה יצוק",
        "en": "Molded construction",
        "ar": "تصميم مصبوب"
      },
      "image": "assets/slide.webp",
      "details": {
        "he": "עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.",
        "en": "An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.",
        "ar": "تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع."
      },
      "components": [
        {
          "id": "strap",
          "label": {
            "he": "הרצועה הרחבה",
            "en": "Broad strap",
            "ar": "الحزام العريض"
          },
          "material": {
            "he": "מעטפת יצוקה בגימור מט",
            "en": "Molded matte finish",
            "ar": "تشطيب مصبوب مطفي"
          },
          "detail": {
            "he": "רצועה מעוגלת חוצה את גב כף הרגל כחלק מהעיצוב האחיד.",
            "en": "A rounded strap crosses the instep as part of the unified design.",
            "ar": "حزام مستدير يعبر ظهر القدم كجزء من التصميم المتكامل."
          },
          "focus": {
            "x": 0.5,
            "y": 0.48,
            "scale": 3.5
          }
        },
        {
          "id": "footbed",
          "label": {
            "he": "משטח הדריכה",
            "en": "Contoured footbed",
            "ar": "موضع القدم"
          },
          "material": {
            "he": "משטח מעוצב בעל מרקם עדין",
            "en": "Shaped surface with fine texture",
            "ar": "سطح مشكّل بملمس ناعم"
          },
          "detail": {
            "he": "השקע לעקב והשפה העולה מגדירים את המשטח הפנימי.",
            "en": "A heel recess and raised rim define the inner surface.",
            "ar": "تجويف الكعب والحافة المرتفعة يحددان السطح الداخلي."
          },
          "focus": {
            "x": 0.29,
            "y": 0.58,
            "scale": 3.5
          }
        },
        {
          "id": "base",
          "label": {
            "he": "הבסיס",
            "en": "Sole base",
            "ar": "قاعدة النعل"
          },
          "material": {
            "he": "בסיס יצוק בגוון טרקוטה",
            "en": "Molded terracotta base",
            "ar": "قاعدة مصبوبة بلون طيني"
          },
          "detail": {
            "he": "העובי העגול ממשיך לאורך הכפכף ומסיים את הצללית הפיסולית.",
            "en": "Rounded thickness runs the length of the slide and completes its sculpted outline.",
            "ar": "السماكة المستديرة تمتد بطول الصندل وتكمل حدوده المنحوتة."
          },
          "focus": {
            "x": 0.58,
            "y": 0.74,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/slide.webp",
      "spin": {
        "src": "assets/spin/slide.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            364,
            727,
            1088,
            1448
          ],
          "y": [
            0,
            362,
            724,
            1086
          ]
        },
        "framing": [
          {
            "cx": 175,
            "cy": 204,
            "scale": 0.75035
          },
          {
            "cx": 181.5,
            "cy": 200,
            "scale": 0.77935
          },
          {
            "cx": 182,
            "cy": 202,
            "scale": 0.81891
          },
          {
            "cx": 185,
            "cy": 195.5,
            "scale": 0.98369
          },
          {
            "cx": 185.5,
            "cy": 179,
            "scale": 0.88156
          },
          {
            "cx": 183,
            "cy": 175,
            "scale": 0.8627
          },
          {
            "cx": 183,
            "cy": 180.5,
            "scale": 0.93794
          },
          {
            "cx": 179,
            "cy": 184,
            "scale": 0.98973
          },
          {
            "cx": 182,
            "cy": 171,
            "scale": 0.95459
          },
          {
            "cx": 180.5,
            "cy": 173.5,
            "scale": 0.7756
          },
          {
            "cx": 176.5,
            "cy": 176.5,
            "scale": 0.76097
          },
          {
            "cx": 177.5,
            "cy": 174.5,
            "scale": 0.74688
          }
        ]
      },
      "new": false,
      "featured": 4,
      "inventory": {
        "clay": {
          "36–37": 7,
          "38–39": 8,
          "40–41": 9,
          "42–43": 10,
          "44–45": 0
        },
        "cream": {
          "36–37": 8,
          "38–39": 9,
          "40–41": 10,
          "42–43": 3,
          "44–45": 0
        },
        "sage": {
          "36–37": 9,
          "38–39": 10,
          "40–41": 3,
          "42–43": 4,
          "44–45": 0
        }
      }
    },
    {
      "id": "pulse",
      "code": "PULSE 06",
      "category": "audio",
      "price": 320,
      "compareAt": 390,
      "surface": "#eee5d9",
      "badge": "SMALL OBJECT. BIG MOOD.",
      "title": {
        "he": "רגע של מוזיקה בכיס",
        "en": "A little music in your pocket",
        "ar": "لحظة موسيقى في جيبك"
      },
      "description": {
        "he": "אוזניות זעירות בקייס עגול. שילוב של שנהב וטרקוטה.",
        "en": "Compact earbuds in a rounded case, pairing ivory with terracotta.",
        "ar": "سماعات صغيرة في علبة مستديرة تجمع العاجي بالطيني."
      },
      "colors": [
        {
          "id": "clay",
          "hex": "#bf6846",
          "filter": "none",
          "label": {
            "he": "טרקוטה",
            "en": "Terracotta",
            "ar": "طيني"
          }
        },
        {
          "id": "cream",
          "hex": "#e8dfca",
          "filter": "saturate(.15) brightness(1.08)",
          "label": {
            "he": "אבן",
            "en": "Stone",
            "ar": "حجري"
          }
        },
        {
          "id": "sage",
          "hex": "#72866d",
          "filter": "hue-rotate(55deg) saturate(.55)",
          "label": {
            "he": "מרווה",
            "en": "Sage",
            "ar": "مريمي"
          }
        }
      ],
      "sizes": [
        "ONE SIZE"
      ],
      "defaultSize": "ONE SIZE",
      "material": {
        "he": "קייס קומפקטי / גימור מט",
        "en": "Compact case / matte finish",
        "ar": "علبة صغيرة / تشطيب مطفي"
      },
      "image": "assets/pulse.webp",
      "details": {
        "he": "עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.",
        "en": "An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.",
        "ar": "تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع."
      },
      "components": [
        {
          "id": "shell",
          "label": {
            "he": "גוף האוזניות",
            "en": "Earbud shells",
            "ar": "جسم السماعتين"
          },
          "material": {
            "he": "גימור מט בשנהב וטרקוטה",
            "en": "Ivory and terracotta matte finish",
            "ar": "تشطيب عاجي وطيني مطفي"
          },
          "detail": {
            "he": "המעטפות הקטנות משלבות ראש מעוגל וזרוע צרה.",
            "en": "The compact shells pair rounded heads with slender stems.",
            "ar": "الغلافان الصغيران يجمعان رأساً مستديراً وساقاً رفيعة."
          },
          "focus": {
            "x": 0.4,
            "y": 0.34,
            "scale": 3.5
          }
        },
        {
          "id": "tips",
          "label": {
            "he": "קצות האוזניות",
            "en": "Ear tips",
            "ar": "أطراف السماعات"
          },
          "material": {
            "he": "קצוות רכים במראה סיליקון",
            "en": "Soft silicone-look tips",
            "ar": "أطراف ناعمة بمظهر السيليكون"
          },
          "detail": {
            "he": "החלקים בגוון טרקוטה ממסגרים את פתחי האוזניות.",
            "en": "Terracotta tips frame the earbud openings.",
            "ar": "الأطراف الطينية تحيط بفتحات السماعات."
          },
          "focus": {
            "x": 0.63,
            "y": 0.24,
            "scale": 3.5
          }
        },
        {
          "id": "case",
          "label": {
            "he": "קייס ומכסה",
            "en": "Case & lid",
            "ar": "العلبة والغطاء"
          },
          "material": {
            "he": "מעטפת קשיחה בגימור חלק",
            "en": "Smooth rigid-look shell",
            "ar": "غلاف بمظهر صلب وناعم"
          },
          "detail": {
            "he": "מכסה מעוגל ושקעי אחסון נפרדים יוצרים את הקייס הפתוח.",
            "en": "A rounded lid and separate storage wells form the open case.",
            "ar": "غطاء مستدير وتجويفا تخزين منفصلان يشكّلون العلبة المفتوحة."
          },
          "focus": {
            "x": 0.48,
            "y": 0.65,
            "scale": 3.5
          }
        },
        {
          "id": "cradle",
          "label": {
            "he": "תושבות פנימיות",
            "en": "Interior cradle",
            "ar": "الحواضن الداخلية"
          },
          "material": {
            "he": "שקעים מעוצבים בגוון תואם",
            "en": "Matching shaped recesses",
            "ar": "تجاويف مشكّلة بلون متناسق"
          },
          "detail": {
            "he": "התושבות מציגות את מיקום האוזניות בקייס; אין כאן נתוני טעינה או סוללה מאומתים.",
            "en": "The cradle shows where each earbud sits; charging and battery specifications are not verified.",
            "ar": "الحواضن توضّح موضع السماعتين؛ بيانات الشحن والبطارية غير مؤكدة."
          },
          "focus": {
            "x": 0.48,
            "y": 0.61,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/pulse.webp",
      "spin": {
        "src": "assets/spin/pulse.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            364,
            728,
            1082,
            1448
          ],
          "y": [
            0,
            365,
            723,
            1086
          ]
        },
        "framing": [
          {
            "cx": 187.5,
            "cy": 181,
            "scale": 0.85994
          },
          {
            "cx": 196.5,
            "cy": 182,
            "scale": 0.85994
          },
          {
            "cx": 197,
            "cy": 182,
            "scale": 0.8649
          },
          {
            "cx": 198.5,
            "cy": 183.5,
            "scale": 0.8674
          },
          {
            "cx": 193.5,
            "cy": 178.5,
            "scale": 0.88271
          },
          {
            "cx": 189,
            "cy": 176.5,
            "scale": 0.89856
          },
          {
            "cx": 179.5,
            "cy": 178.5,
            "scale": 0.88271
          },
          {
            "cx": 171.5,
            "cy": 179.5,
            "scale": 0.89321
          },
          {
            "cx": 180.5,
            "cy": 185,
            "scale": 0.90126
          },
          {
            "cx": 170,
            "cy": 183.5,
            "scale": 0.88271
          },
          {
            "cx": 169.5,
            "cy": 182.5,
            "scale": 0.87754
          },
          {
            "cx": 184,
            "cy": 181.5,
            "scale": 0.87244
          }
        ]
      },
      "new": false,
      "featured": 5,
      "inventory": {
        "clay": {
          "ONE SIZE": 8
        },
        "cream": {
          "ONE SIZE": 9
        },
        "sage": {
          "ONE SIZE": 10
        }
      }
    },
    {
      "id": "echo",
      "code": "ECHO 07",
      "category": "audio",
      "price": 240,
      "compareAt": null,
      "surface": "#e2e7db",
      "badge": "SET THE ATMOSPHERE",
      "title": {
        "he": "הפסקול הולך איתך",
        "en": "Bring your own atmosphere",
        "ar": "خذ أجواءك معك"
      },
      "description": {
        "he": "רמקול ירוק קומפקטי בטקסטורה ארוגה עם לולאת נשיאה בהירה.",
        "en": "A compact green speaker with a woven texture and a pale carry loop.",
        "ar": "مكبر أخضر صغير بنسيج منسوج وحلقة حمل فاتحة."
      },
      "colors": [
        {
          "id": "green",
          "hex": "#29483a",
          "filter": "none",
          "label": {
            "he": "ירוק יער",
            "en": "Forest",
            "ar": "أخضر غابة"
          }
        },
        {
          "id": "clay",
          "hex": "#bf6846",
          "filter": "hue-rotate(45deg) saturate(.6)",
          "label": {
            "he": "טרקוטה",
            "en": "Terracotta",
            "ar": "طيني"
          }
        },
        {
          "id": "charcoal",
          "hex": "#353d36",
          "filter": "saturate(.1) brightness(.62)",
          "label": {
            "he": "פחם",
            "en": "Charcoal",
            "ar": "فحمي"
          }
        }
      ],
      "sizes": [
        "ONE SIZE"
      ],
      "defaultSize": "ONE SIZE",
      "material": {
        "he": "מעטפת ארוגה / לולאת נשיאה",
        "en": "Woven shell / carry loop",
        "ar": "غلاف منسوج / حلقة حمل"
      },
      "image": "assets/echo.webp",
      "details": {
        "he": "עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.",
        "en": "An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.",
        "ar": "تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع."
      },
      "components": [
        {
          "id": "grille",
          "label": {
            "he": "מעטפת ארוגה",
            "en": "Woven grille",
            "ar": "الغلاف المنسوج"
          },
          "material": {
            "he": "אריג ירוק בעל דוגמה צפופה",
            "en": "Dense green woven texture",
            "ar": "نسيج أخضر بنمط كثيف"
          },
          "detail": {
            "he": "האריגה מקיפה את גוף הרמקול הגלילי ויוצרת את המרקם הראשי.",
            "en": "The weave wraps the cylindrical body and defines its main texture.",
            "ar": "النسيج يحيط بالجسم الأسطواني ويحدد ملمسه الرئيسي."
          },
          "focus": {
            "x": 0.5,
            "y": 0.51,
            "scale": 3.5
          }
        },
        {
          "id": "ends",
          "label": {
            "he": "קצוות עגולים",
            "en": "Rounded end caps",
            "ar": "الأطراف المستديرة"
          },
          "material": {
            "he": "טבעת בגימור מט ודיסק פנימי",
            "en": "Matte ring and inner disc",
            "ar": "حلقة مطفية وقرص داخلي"
          },
          "detail": {
            "he": "הטבעת העבה והדיסק הכהה מסיימים את שני צדי הגוף.",
            "en": "A thick ring and darker disc finish the ends of the body.",
            "ar": "حلقة سميكة وقرص داكن يكملان طرفي الجسم."
          },
          "focus": {
            "x": 0.27,
            "y": 0.64,
            "scale": 3.5
          }
        },
        {
          "id": "button",
          "label": {
            "he": "כפתור עליון",
            "en": "Top button",
            "ar": "الزر العلوي"
          },
          "material": {
            "he": "פרט כתום בגימור מט",
            "en": "Matte orange detail",
            "ar": "تفصيل برتقالي مطفي"
          },
          "detail": {
            "he": "נגיעה קטנה של טרקוטה מסמנת את אזור השליטה בקונספט.",
            "en": "A small terracotta accent marks the concept’s control area.",
            "ar": "لمسة طينية صغيرة تحدد منطقة التحكم في التصميم."
          },
          "focus": {
            "x": 0.49,
            "y": 0.36,
            "scale": 3.5
          }
        },
        {
          "id": "loop",
          "label": {
            "he": "לולאת הנשיאה",
            "en": "Carry loop",
            "ar": "حلقة الحمل"
          },
          "material": {
            "he": "רצועה ארוגה בגוון שמנת",
            "en": "Cream woven strap",
            "ar": "حزام منسوج كريمي"
          },
          "detail": {
            "he": "לולאה קצרה יוצאת מהקצה ומוסיפה ניגוד לטקסטורה הירוקה.",
            "en": "A short loop extends from the end, contrasting with the green texture.",
            "ar": "حلقة قصيرة تمتد من الطرف وتباين الملمس الأخضر."
          },
          "focus": {
            "x": 0.78,
            "y": 0.25,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/echo.webp",
      "spin": {
        "src": "assets/spin/echo.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            366,
            730,
            1082,
            1448
          ],
          "y": [
            0,
            374,
            706,
            1086
          ]
        },
        "framing": [
          {
            "cx": 191,
            "cy": 194.5,
            "scale": 0.78781
          },
          {
            "cx": 177.5,
            "cy": 194.5,
            "scale": 0.78781
          },
          {
            "cx": 171.5,
            "cy": 194,
            "scale": 0.79522
          },
          {
            "cx": 175.5,
            "cy": 178,
            "scale": 0.9501
          },
          {
            "cx": 192,
            "cy": 170.5,
            "scale": 0.99092
          },
          {
            "cx": 186.5,
            "cy": 166.5,
            "scale": 0.88082
          },
          {
            "cx": 164,
            "cy": 166.5,
            "scale": 0.85126
          },
          {
            "cx": 183,
            "cy": 166,
            "scale": 1.02703
          },
          {
            "cx": 197.5,
            "cy": 174,
            "scale": 0.81047
          },
          {
            "cx": 179.5,
            "cy": 171,
            "scale": 0.97944
          },
          {
            "cx": 184.5,
            "cy": 175,
            "scale": 0.80024
          },
          {
            "cx": 186.5,
            "cy": 174.5,
            "scale": 0.82362
          }
        ]
      },
      "new": true,
      "featured": 6,
      "inventory": {
        "green": {
          "ONE SIZE": 0
        },
        "clay": {
          "ONE SIZE": 0
        },
        "charcoal": {
          "ONE SIZE": 0
        }
      }
    },
    {
      "id": "roam",
      "code": "ROAM 08",
      "category": "bags",
      "price": 420,
      "compareAt": 520,
      "surface": "#e5e7dc",
      "badge": "WEEKEND STATE OF MIND",
      "title": {
        "he": "סוף השבוע מתחיל כאן",
        "en": "The weekend starts here",
        "ar": "عطلة الأسبوع تبدأ هنا"
      },
      "description": {
        "he": "תיק סוף שבוע רך בירוק יער, רצועות שמנת ופרטי טרקוטה.",
        "en": "A soft forest-green weekender with cream straps and terracotta details.",
        "ar": "حقيبة عطلة ناعمة بلون الغابة وأحزمة كريمية وتفاصيل طينية."
      },
      "colors": [
        {
          "id": "green",
          "hex": "#29483a",
          "filter": "none",
          "label": {
            "he": "ירוק יער",
            "en": "Forest",
            "ar": "أخضر غابة"
          }
        },
        {
          "id": "sand",
          "hex": "#d9c4a0",
          "filter": "hue-rotate(45deg) saturate(.6)",
          "label": {
            "he": "חול",
            "en": "Sand",
            "ar": "رملي"
          }
        },
        {
          "id": "charcoal",
          "hex": "#353d36",
          "filter": "saturate(.1) brightness(.62)",
          "label": {
            "he": "פחם",
            "en": "Charcoal",
            "ar": "فحمي"
          }
        }
      ],
      "sizes": [
        "COMPACT",
        "WEEKENDER"
      ],
      "defaultSize": "WEEKENDER",
      "material": {
        "he": "אריג ניילון / רצועה מתכווננת",
        "en": "Nylon weave / adjustable strap",
        "ar": "نسيج نايلون / حزام قابل للتعديل"
      },
      "image": "assets/roam.webp",
      "details": {
        "he": "עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.",
        "en": "An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.",
        "ar": "تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع."
      },
      "components": [
        {
          "id": "body",
          "label": {
            "he": "התא המרכזי",
            "en": "Main compartment",
            "ar": "الحجرة الرئيسية"
          },
          "material": {
            "he": "אריג ניילון בירוק יער",
            "en": "Forest-green nylon weave",
            "ar": "نسيج نايلون أخضر غابة"
          },
          "detail": {
            "he": "גוף רך ומוארך, עם פאנלי קצה עגולים ותפרי מתאר.",
            "en": "A soft elongated body with rounded end panels and contour seams.",
            "ar": "جسم ناعم ممدود مع لوحين طرفيين مستديرين وخياطة محيطية."
          },
          "focus": {
            "x": 0.51,
            "y": 0.58,
            "scale": 3.5
          }
        },
        {
          "id": "handles",
          "label": {
            "he": "ידיות הנשיאה",
            "en": "Carry handles",
            "ar": "مقابض الحمل"
          },
          "material": {
            "he": "רצועות אריג בגוון שמנת",
            "en": "Cream webbing straps",
            "ar": "أحزمة منسوجة كريمية"
          },
          "detail": {
            "he": "שתי ידיות ממשיכות לאורך חזית התיק ונפגשות מעליו.",
            "en": "Two handles run along the front and meet above the bag.",
            "ar": "مقبضان يمتدان بمحاذاة الواجهة ويلتقيان فوق الحقيبة."
          },
          "focus": {
            "x": 0.48,
            "y": 0.35,
            "scale": 3.5
          }
        },
        {
          "id": "zip",
          "label": {
            "he": "הסגירה העליונה",
            "en": "Top closure",
            "ar": "الإغلاق العلوي"
          },
          "material": {
            "he": "רוכסן ומשיכות טרקוטה",
            "en": "Zip with terracotta pulls",
            "ar": "سحاب مع سحّابات طينية"
          },
          "detail": {
            "he": "רוכסן ארוך מגדיר את פתח התא, עם שתי משיכות נפרדות.",
            "en": "A long zip defines the compartment opening with two separate pulls.",
            "ar": "سحاب طويل يحدد فتحة الحجرة مع سحّابتين منفصلتين."
          },
          "focus": {
            "x": 0.52,
            "y": 0.43,
            "scale": 3.5
          }
        },
        {
          "id": "strap",
          "label": {
            "he": "רצועת הכתף",
            "en": "Shoulder strap",
            "ar": "حزام الكتف"
          },
          "material": {
            "he": "רצועת אריג וכרית תואמת",
            "en": "Webbing strap and matching pad",
            "ar": "حزام منسوج ووسادة متناسقة"
          },
          "detail": {
            "he": "רצועה נפרדת מתחברת לשני קצות התיק וכוללת אזור רחב במרכז.",
            "en": "A separate strap joins the two ends and has a wider central pad.",
            "ar": "حزام منفصل يتصل بالطرفين ويحتوي وسادة وسطية عريضة."
          },
          "focus": {
            "x": 0.57,
            "y": 0.77,
            "scale": 3.5
          }
        },
        {
          "id": "hardware",
          "label": {
            "he": "טבעות ומחברים",
            "en": "Rings & attachments",
            "ar": "الحلقات والوصلات"
          },
          "material": {
            "he": "אביזרי חיבור בגימור מתכתי",
            "en": "Metal-look attachments",
            "ar": "وصلات بمظهر معدني"
          },
          "detail": {
            "he": "טבעות בקצוות מחברות את הרצועה אל גוף התיק.",
            "en": "End rings connect the strap to the main body.",
            "ar": "حلقات طرفية تصل الحزام بجسم الحقيبة."
          },
          "focus": {
            "x": 0.2,
            "y": 0.53,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/roam.webp",
      "spin": {
        "src": "assets/spin/roam.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            385,
            715,
            1081,
            1448
          ],
          "y": [
            0,
            364,
            714,
            1086
          ]
        },
        "framing": [
          {
            "cx": 198.5,
            "cy": 194,
            "scale": 0.90579
          },
          {
            "cx": 169,
            "cy": 197.5,
            "scale": 0.92362
          },
          {
            "cx": 182.5,
            "cy": 198.5,
            "scale": 0.9093
          },
          {
            "cx": 152,
            "cy": 197,
            "scale": 0.87865
          },
          {
            "cx": 202,
            "cy": 174.5,
            "scale": 0.9384
          },
          {
            "cx": 164.5,
            "cy": 174.5,
            "scale": 0.9384
          },
          {
            "cx": 189,
            "cy": 175,
            "scale": 0.98159
          },
          {
            "cx": 189.5,
            "cy": 175.5,
            "scale": 0.92362
          },
          {
            "cx": 208,
            "cy": 182,
            "scale": 0.89885
          },
          {
            "cx": 195.5,
            "cy": 169.5,
            "scale": 0.82605
          },
          {
            "cx": 173,
            "cy": 179.5,
            "scale": 0.9023
          },
          {
            "cx": 177,
            "cy": 180,
            "scale": 0.92
          }
        ]
      },
      "new": true,
      "featured": 7,
      "inventory": {
        "green": {
          "COMPACT": 10,
          "WEEKENDER": 3
        },
        "sand": {
          "COMPACT": 3,
          "WEEKENDER": 4
        },
        "charcoal": {
          "COMPACT": 4,
          "WEEKENDER": 5
        }
      }
    },
    {
      "id": "orbit",
      "code": "ORBIT 09",
      "category": "bags",
      "price": 260,
      "compareAt": null,
      "surface": "#eee5d9",
      "badge": "HANDS FREE. MIND OPEN.",
      "title": {
        "he": "לקחת רק מה שצריך",
        "en": "Only what you need",
        "ar": "فقط ما تحتاجه"
      },
      "description": {
        "he": "תיק צד בצורת חצי ירח, בגוון חול עם רצועת טרקוטה.",
        "en": "A sand crescent crossbody with a terracotta strap.",
        "ar": "حقيبة كتف هلالية رملية بحزام طيني."
      },
      "colors": [
        {
          "id": "sand",
          "hex": "#d9c4a0",
          "filter": "none",
          "label": {
            "he": "חול",
            "en": "Sand",
            "ar": "رملي"
          }
        },
        {
          "id": "sage",
          "hex": "#72866d",
          "filter": "hue-rotate(55deg) saturate(.55)",
          "label": {
            "he": "מרווה",
            "en": "Sage",
            "ar": "مريمي"
          }
        },
        {
          "id": "charcoal",
          "hex": "#353d36",
          "filter": "saturate(.1) brightness(.62)",
          "label": {
            "he": "פחם",
            "en": "Charcoal",
            "ar": "فحمي"
          }
        }
      ],
      "sizes": [
        "ONE SIZE"
      ],
      "defaultSize": "ONE SIZE",
      "material": {
        "he": "דמוי עור / רצועת צד",
        "en": "Leather-look / crossbody strap",
        "ar": "مظهر جلدي / حزام كتف"
      },
      "image": "assets/orbit.webp",
      "details": {
        "he": "עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.",
        "en": "An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.",
        "ar": "تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع."
      },
      "components": [
        {
          "id": "body",
          "label": {
            "he": "גוף חצי הירח",
            "en": "Crescent body",
            "ar": "الجسم الهلالي"
          },
          "material": {
            "he": "דמוי עור בגוון חול",
            "en": "Sand leather-look finish",
            "ar": "تشطيب رملي بمظهر جلدي"
          },
          "detail": {
            "he": "שני פאנלים מעוגלים נפגשים בתפרי קצה ויוצרים צורת סהר.",
            "en": "Rounded panels meet at edge seams to create the crescent form.",
            "ar": "ألواح مستديرة تلتقي عند خياطة الحواف لتشكّل الهلال."
          },
          "focus": {
            "x": 0.5,
            "y": 0.65,
            "scale": 3.5
          }
        },
        {
          "id": "zip",
          "label": {
            "he": "פתח ורוכסן",
            "en": "Opening & zip",
            "ar": "الفتحة والسحاب"
          },
          "material": {
            "he": "רוכסן ומשיכה בגוון טרקוטה",
            "en": "Zip and terracotta pull",
            "ar": "سحاب وسحّابة طينية"
          },
          "detail": {
            "he": "קו הסגירה עוקב אחר הקימור העליון של גוף התיק.",
            "en": "The closure follows the curve along the top of the bag.",
            "ar": "الإغلاق يتبع الانحناء العلوي لجسم الحقيبة."
          },
          "focus": {
            "x": 0.48,
            "y": 0.49,
            "scale": 3.5
          }
        },
        {
          "id": "strap",
          "label": {
            "he": "הרצועה",
            "en": "Shoulder strap",
            "ar": "حزام الكتف"
          },
          "material": {
            "he": "רצועת דמוי עור בטרקוטה",
            "en": "Terracotta leather-look strap",
            "ar": "حزام طيني بمظهر جلدي"
          },
          "detail": {
            "he": "הרצועה הרחבה כוללת חורי כוונון ותפירה לאורך הקצוות.",
            "en": "The broad strap has adjustment holes and edge stitching.",
            "ar": "الحزام العريض يتضمن فتحات تعديل وخياطة على الحواف."
          },
          "focus": {
            "x": 0.57,
            "y": 0.28,
            "scale": 3.5
          }
        },
        {
          "id": "buckle",
          "label": {
            "he": "אבזם וטבעות",
            "en": "Buckle & rings",
            "ar": "الإبزيم والحلقات"
          },
          "material": {
            "he": "גימור מתכתי מעוגל",
            "en": "Rounded metal-look finish",
            "ar": "تشطيب معدني مستدير"
          },
          "detail": {
            "he": "אבזם מעוגל וטבעות צד משלימים את נקודות החיבור של הרצועה.",
            "en": "A rounded buckle and side rings complete the strap attachments.",
            "ar": "إبزيم مستدير وحلقات جانبية تكمل نقاط اتصال الحزام."
          },
          "focus": {
            "x": 0.63,
            "y": 0.26,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/orbit.webp",
      "spin": {
        "src": "assets/spin/orbit.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            376,
            729,
            1087,
            1448
          ],
          "y": [
            0,
            354,
            705,
            1086
          ]
        },
        "framing": [
          {
            "cx": 212,
            "cy": 172.5,
            "scale": 0.94673
          },
          {
            "cx": 194.5,
            "cy": 174.5,
            "scale": 0.94102
          },
          {
            "cx": 187.5,
            "cy": 174.5,
            "scale": 0.94102
          },
          {
            "cx": 180.5,
            "cy": 174,
            "scale": 0.94387
          },
          {
            "cx": 186.5,
            "cy": 177.5,
            "scale": 0.94673
          },
          {
            "cx": 163.5,
            "cy": 176,
            "scale": 0.96724
          },
          {
            "cx": 178,
            "cy": 178,
            "scale": 0.9496
          },
          {
            "cx": 179,
            "cy": 178,
            "scale": 0.9496
          },
          {
            "cx": 185.5,
            "cy": 180,
            "scale": 0.92706
          },
          {
            "cx": 159.5,
            "cy": 179,
            "scale": 0.91619
          },
          {
            "cx": 161.5,
            "cy": 182,
            "scale": 0.91619
          },
          {
            "cx": 182.5,
            "cy": 182,
            "scale": 0.92159
          }
        ]
      },
      "new": true,
      "featured": 8,
      "inventory": {
        "sand": {
          "ONE SIZE": 3
        },
        "sage": {
          "ONE SIZE": 4
        },
        "charcoal": {
          "ONE SIZE": 5
        }
      }
    },
    {
      "id": "form",
      "code": "FORM 10",
      "category": "apparel",
      "price": 280,
      "compareAt": 350,
      "surface": "#e5e8dc",
      "badge": "ROOM TO BE YOURSELF",
      "title": {
        "he": "השכבה שתמיד חוזרים אליה",
        "en": "Your everyday layer",
        "ar": "طبقتك اليومية"
      },
      "description": {
        "he": "קפוצ׳ון אוברסייז בגוון מרווה עם כיס קדמי וקפוצ׳ון נדיב.",
        "en": "An oversized sage hoodie with a kangaroo pocket and generous hood.",
        "ar": "هودي واسع بلون مريمي وجيب أمامي وغطاء رأس كبير."
      },
      "colors": [
        {
          "id": "sage",
          "hex": "#72866d",
          "filter": "none",
          "label": {
            "he": "מרווה",
            "en": "Sage",
            "ar": "مريمي"
          }
        },
        {
          "id": "cream",
          "hex": "#e8dfca",
          "filter": "saturate(.15) brightness(1.08)",
          "label": {
            "he": "אבן",
            "en": "Stone",
            "ar": "حجري"
          }
        },
        {
          "id": "charcoal",
          "hex": "#353d36",
          "filter": "saturate(.1) brightness(.62)",
          "label": {
            "he": "פחם",
            "en": "Charcoal",
            "ar": "فحمي"
          }
        }
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "defaultSize": "M",
      "material": {
        "he": "מראה כותנה עבה / גזרת אוברסייז",
        "en": "Heavy cotton look / oversized fit",
        "ar": "مظهر قطني سميك / قصة واسعة"
      },
      "image": "assets/form.webp",
      "details": {
        "he": "עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.",
        "en": "An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.",
        "ar": "تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع."
      },
      "components": [
        {
          "id": "fabric",
          "label": {
            "he": "גוף הבגד",
            "en": "Body fabric",
            "ar": "قماش الجسم"
          },
          "material": {
            "he": "אריג במראה כותנה עבה",
            "en": "Heavy cotton-look fabric",
            "ar": "قماش بمظهر قطني سميك"
          },
          "detail": {
            "he": "מרקם בגוון מרווה וגזרה רחבה מגדירים את החזית והשרוולים.",
            "en": "A sage texture and generous cut define the front and sleeves.",
            "ar": "ملمس مريمي وقصة واسعة يحددان الواجهة والأكمام."
          },
          "focus": {
            "x": 0.48,
            "y": 0.5,
            "scale": 3.5
          }
        },
        {
          "id": "hood",
          "label": {
            "he": "הקפוצ׳ון",
            "en": "Hood",
            "ar": "غطاء الرأس"
          },
          "material": {
            "he": "שכבות בד וקו תפר מרכזי",
            "en": "Fabric layers and a central seam",
            "ar": "طبقات قماش وخط خياطة أوسط"
          },
          "detail": {
            "he": "פתח רחב, קפלי בד ותפר מתאר יוצרים את החלק העליון.",
            "en": "A wide opening, fabric folds and contour seam form the hood.",
            "ar": "فتحة واسعة وثنيات قماش وخياطة محيطية تشكّل الغطاء."
          },
          "focus": {
            "x": 0.49,
            "y": 0.23,
            "scale": 3.5
          }
        },
        {
          "id": "pocket",
          "label": {
            "he": "כיס הקנגורו",
            "en": "Kangaroo pocket",
            "ar": "الجيب الأمامي"
          },
          "material": {
            "he": "פאנל קדמי עם פתחי צד",
            "en": "Front panel with side openings",
            "ar": "لوح أمامي بفتحات جانبية"
          },
          "detail": {
            "he": "כיס רחב נתפר מעל גוף הבגד, עם שני פתחים משופעים.",
            "en": "A wide pocket is stitched over the body with two slanted openings.",
            "ar": "جيب عريض مخيط فوق الجسم مع فتحتين مائلتين."
          },
          "focus": {
            "x": 0.5,
            "y": 0.65,
            "scale": 3.5
          }
        },
        {
          "id": "cuffs",
          "label": {
            "he": "סיומות השרוולים",
            "en": "Sleeve cuffs",
            "ar": "أساور الأكمام"
          },
          "material": {
            "he": "סיומת במראה ריב סרוג",
            "en": "Rib-knit-look finish",
            "ar": "تشطيب بمظهر نسيج مضلع"
          },
          "detail": {
            "he": "טקסטורה צפופה ומצולעת מסיימת את שני השרוולים.",
            "en": "A dense ribbed texture finishes both sleeves.",
            "ar": "ملمس مضلع كثيف يكمل طرفي الكمين."
          },
          "focus": {
            "x": 0.24,
            "y": 0.78,
            "scale": 3.5
          }
        },
        {
          "id": "hem",
          "label": {
            "he": "הסיומת התחתונה",
            "en": "Bottom hem",
            "ar": "الحافة السفلية"
          },
          "material": {
            "he": "רצועת ריב רחבה",
            "en": "Broad ribbed band",
            "ar": "شريط مضلع عريض"
          },
          "detail": {
            "he": "פס רחב בתחתית ממשיך את שפת הסיומות של השרוולים.",
            "en": "A broad bottom band echoes the sleeve cuffs.",
            "ar": "شريط عريض في الأسفل يكرر تشطيب أساور الأكمام."
          },
          "focus": {
            "x": 0.5,
            "y": 0.82,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/form.webp",
      "spin": {
        "src": "assets/spin/form.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            384,
            724,
            1083,
            1448
          ],
          "y": [
            0,
            364,
            710,
            1086
          ]
        },
        "framing": [
          {
            "cx": 216,
            "cy": 185,
            "scale": 0.98708
          },
          {
            "cx": 177,
            "cy": 186.5,
            "scale": 0.96
          },
          {
            "cx": 176.5,
            "cy": 187.5,
            "scale": 0.94843
          },
          {
            "cx": 167.5,
            "cy": 187,
            "scale": 0.9513
          },
          {
            "cx": 214,
            "cy": 171,
            "scale": 0.97486
          },
          {
            "cx": 181,
            "cy": 172,
            "scale": 0.98093
          },
          {
            "cx": 179,
            "cy": 171,
            "scale": 0.98093
          },
          {
            "cx": 179.5,
            "cy": 172.5,
            "scale": 0.984
          },
          {
            "cx": 207.5,
            "cy": 179.5,
            "scale": 0.95418
          },
          {
            "cx": 174.5,
            "cy": 180.5,
            "scale": 0.95418
          },
          {
            "cx": 182.5,
            "cy": 177.5,
            "scale": 0.96
          },
          {
            "cx": 170,
            "cy": 179,
            "scale": 0.95708
          }
        ]
      },
      "new": true,
      "featured": 9,
      "inventory": {
        "sage": {
          "XS": 4,
          "S": 5,
          "M": 6,
          "L": 7,
          "XL": 8,
          "XXL": 0
        },
        "cream": {
          "XS": 5,
          "S": 6,
          "M": 7,
          "L": 8,
          "XL": 9,
          "XXL": 0
        },
        "charcoal": {
          "XS": 0,
          "S": 0,
          "M": 0,
          "L": 0,
          "XL": 0,
          "XXL": 0
        }
      }
    },
    {
      "id": "shell",
      "code": "SHELL 11",
      "category": "apparel",
      "price": 360,
      "compareAt": null,
      "surface": "#eedfd3",
      "badge": "CHANGE OF WEATHER",
      "title": {
        "he": "לצאת, גם בלי תכנית",
        "en": "Step out without a plan",
        "ar": "انطلق دون خطة"
      },
      "description": {
        "he": "ג׳קט קל בטרקוטה ושמנת, עם רוכסן מלא וצווארון עומד.",
        "en": "A lightweight terracotta and cream jacket, full zip and stand collar.",
        "ar": "سترة خفيفة طينية وكريمية بسحاب كامل وياقة قائمة."
      },
      "colors": [
        {
          "id": "clay",
          "hex": "#bf6846",
          "filter": "none",
          "label": {
            "he": "טרקוטה",
            "en": "Terracotta",
            "ar": "طيني"
          }
        },
        {
          "id": "sage",
          "hex": "#72866d",
          "filter": "hue-rotate(55deg) saturate(.55)",
          "label": {
            "he": "מרווה",
            "en": "Sage",
            "ar": "مريمي"
          }
        },
        {
          "id": "charcoal",
          "hex": "#353d36",
          "filter": "saturate(.1) brightness(.62)",
          "label": {
            "he": "פחם",
            "en": "Charcoal",
            "ar": "فحمي"
          }
        }
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "defaultSize": "M",
      "material": {
        "he": "אריג קל / גזרה רגועה",
        "en": "Lightweight weave / relaxed fit",
        "ar": "نسيج خفيف / قصة مريحة"
      },
      "image": "assets/shell.webp",
      "details": {
        "he": "עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.",
        "en": "An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.",
        "ar": "تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع."
      },
      "components": [
        {
          "id": "panels",
          "label": {
            "he": "פאנלי המעטפת",
            "en": "Outer panels",
            "ar": "ألواح الغلاف"
          },
          "material": {
            "he": "אריג קל בשילוב גוונים",
            "en": "Lightweight color-block weave",
            "ar": "نسيج خفيف متعدد الألوان"
          },
          "detail": {
            "he": "פאנלים בשמנת, ירוק וטרקוטה נפגשים בתפרים גאומטריים.",
            "en": "Cream, green and terracotta panels meet at geometric seams.",
            "ar": "ألواح كريمية وخضراء وطينية تلتقي عند خياطة هندسية."
          },
          "focus": {
            "x": 0.45,
            "y": 0.48,
            "scale": 3.5
          }
        },
        {
          "id": "collar",
          "label": {
            "he": "הצווארון",
            "en": "Stand collar",
            "ar": "الياقة القائمة"
          },
          "material": {
            "he": "צווארון בד כפול",
            "en": "Double-layer fabric collar",
            "ar": "ياقة قماش مزدوجة"
          },
          "detail": {
            "he": "צווארון עומד עם פנים כהים יותר ממסגר את פתח הצוואר.",
            "en": "A stand collar with a darker interior frames the neckline.",
            "ar": "ياقة قائمة بداخل أغمق تحيط بفتحة الرقبة."
          },
          "focus": {
            "x": 0.5,
            "y": 0.23,
            "scale": 3.5
          }
        },
        {
          "id": "zip",
          "label": {
            "he": "הרוכסן המרכזי",
            "en": "Front zip",
            "ar": "السحاب الأمامي"
          },
          "material": {
            "he": "רוכסן ארוך ומשיכת צבע",
            "en": "Full-length zip with colored pull",
            "ar": "سحاب كامل مع سحّابة ملونة"
          },
          "detail": {
            "he": "קו רוכסן רציף עובר מהצווארון עד לסיומת התחתונה.",
            "en": "A continuous zip runs from the collar to the bottom hem.",
            "ar": "سحاب متصل يمتد من الياقة إلى الحافة السفلية."
          },
          "focus": {
            "x": 0.5,
            "y": 0.52,
            "scale": 3.5
          }
        },
        {
          "id": "pockets",
          "label": {
            "he": "כיסי הצד",
            "en": "Side pockets",
            "ar": "الجيوب الجانبية"
          },
          "material": {
            "he": "פתחי כיס אלכסוניים",
            "en": "Slanted pocket openings",
            "ar": "فتحات جيوب مائلة"
          },
          "detail": {
            "he": "שני פתחים בחזית ממוקמים בתוך הפאנלים התחתונים.",
            "en": "Two front openings sit within the lower panels.",
            "ar": "فتحتان أماميتان تقعان ضمن الألواح السفلية."
          },
          "focus": {
            "x": 0.62,
            "y": 0.63,
            "scale": 3.5
          }
        },
        {
          "id": "edges",
          "label": {
            "he": "קצוות השרוולים והמותן",
            "en": "Cuffs & hem",
            "ar": "الأساور والحافة"
          },
          "material": {
            "he": "סיומות בד מכווצות",
            "en": "Gathered fabric edges",
            "ar": "حواف قماش مجمّعة"
          },
          "detail": {
            "he": "קפלים צפופים אוספים את הבד בקצות השרוולים ובתחתית.",
            "en": "Small gathers collect the fabric at the cuffs and lower edge.",
            "ar": "ثنيات صغيرة تجمع القماش عند الأساور والحافة السفلية."
          },
          "focus": {
            "x": 0.76,
            "y": 0.8,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/shell.webp",
      "spin": {
        "src": "assets/spin/shell.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            380,
            726,
            1081,
            1448
          ],
          "y": [
            0,
            358,
            700,
            1086
          ]
        },
        "framing": [
          {
            "cx": 211,
            "cy": 177.5,
            "scale": 0.98912
          },
          {
            "cx": 184.5,
            "cy": 178.5,
            "scale": 0.97092
          },
          {
            "cx": 193,
            "cy": 179,
            "scale": 0.96795
          },
          {
            "cx": 168.5,
            "cy": 182,
            "scale": 0.95051
          },
          {
            "cx": 221.5,
            "cy": 173,
            "scale": 0.97994
          },
          {
            "cx": 185,
            "cy": 172.5,
            "scale": 0.98298
          },
          {
            "cx": 176.5,
            "cy": 170.5,
            "scale": 0.98912
          },
          {
            "cx": 166,
            "cy": 173.5,
            "scale": 0.98298
          },
          {
            "cx": 210.5,
            "cy": 175.5,
            "scale": 0.94202
          },
          {
            "cx": 149.5,
            "cy": 175,
            "scale": 0.94484
          },
          {
            "cx": 165,
            "cy": 173,
            "scale": 0.96207
          },
          {
            "cx": 165.5,
            "cy": 171.5,
            "scale": 0.965
          }
        ]
      },
      "new": true,
      "featured": 10,
      "inventory": {
        "clay": {
          "XS": 5,
          "S": 6,
          "M": 7,
          "L": 8,
          "XL": 9,
          "XXL": 0
        },
        "sage": {
          "XS": 6,
          "S": 7,
          "M": 8,
          "L": 9,
          "XL": 10,
          "XXL": 0
        },
        "charcoal": {
          "XS": 7,
          "S": 8,
          "M": 9,
          "L": 10,
          "XL": 3,
          "XXL": 0
        }
      }
    },
    {
      "id": "loop",
      "code": "LOOP 12",
      "category": "accessories",
      "price": 120,
      "compareAt": null,
      "surface": "#eee8da",
      "badge": "A SMALL DAILY RITUAL",
      "title": {
        "he": "עצירה קטנה באמצע היום",
        "en": "A small daily ritual",
        "ar": "طقس يومي صغير"
      },
      "description": {
        "he": "בקבוק שנהב, פקק טרקוטה ולולאת נשיאה ירוקה. אובייקט קטן עם אופי.",
        "en": "An ivory bottle, terracotta cap and green carry loop. A small object with character.",
        "ar": "زجاجة عاجية بغطاء طيني وحلقة حمل خضراء. قطعة صغيرة بشخصية."
      },
      "colors": [
        {
          "id": "sand",
          "hex": "#d9c4a0",
          "filter": "none",
          "label": {
            "he": "חול",
            "en": "Sand",
            "ar": "رملي"
          }
        },
        {
          "id": "sage",
          "hex": "#72866d",
          "filter": "hue-rotate(55deg) saturate(.55)",
          "label": {
            "he": "מרווה",
            "en": "Sage",
            "ar": "مريمي"
          }
        },
        {
          "id": "charcoal",
          "hex": "#353d36",
          "filter": "saturate(.1) brightness(.62)",
          "label": {
            "he": "פחם",
            "en": "Charcoal",
            "ar": "فحمي"
          }
        }
      ],
      "sizes": [
        "500 ML",
        "750 ML"
      ],
      "defaultSize": "500 ML",
      "material": {
        "he": "מראה מתכת / לולאת סיליקון",
        "en": "Metal finish / silicone loop",
        "ar": "تشطيب معدني / حلقة سيليكون"
      },
      "image": "assets/loop.webp",
      "details": {
        "he": "עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.",
        "en": "An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.",
        "ar": "تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع."
      },
      "components": [
        {
          "id": "body",
          "label": {
            "he": "גוף הבקבוק",
            "en": "Bottle body",
            "ar": "جسم الزجاجة"
          },
          "material": {
            "he": "גימור מתכתי בגוון שנהב",
            "en": "Ivory metal-look finish",
            "ar": "تشطيب عاجي بمظهر معدني"
          },
          "detail": {
            "he": "גוף גלילי עם דפנות נקיות וקצה תחתון מעוגל.",
            "en": "A cylindrical body with clean sides and a rounded base edge.",
            "ar": "جسم أسطواني بجوانب نقية وحافة قاعدة مستديرة."
          },
          "focus": {
            "x": 0.4,
            "y": 0.57,
            "scale": 3.5
          }
        },
        {
          "id": "cap",
          "label": {
            "he": "הפקק",
            "en": "Screw cap",
            "ar": "الغطاء اللولبي"
          },
          "material": {
            "he": "מעטפת טרקוטה בגימור מט",
            "en": "Matte terracotta shell",
            "ar": "غلاف طيني مطفي"
          },
          "detail": {
            "he": "פקק מעוגל סוגר את החלק העליון; בתמונה מוצג גם פרט פקק נפרד.",
            "en": "A rounded cap closes the top; a separate cap detail is also shown.",
            "ar": "غطاء مستدير يغلق الأعلى؛ تظهر أيضاً لقطة لغطاء منفصل."
          },
          "focus": {
            "x": 0.41,
            "y": 0.24,
            "scale": 3.5
          }
        },
        {
          "id": "loop",
          "label": {
            "he": "לולאת הנשיאה",
            "en": "Carry loop",
            "ar": "حلقة الحمل"
          },
          "material": {
            "he": "רצועה ירוקה במראה סיליקון",
            "en": "Green silicone-look strap",
            "ar": "حزام أخضر بمظهر السيليكون"
          },
          "detail": {
            "he": "לולאה עבה יוצאת מהפקק ויוצרת פרט צבע נוסף.",
            "en": "A thick loop extends from the cap as a contrasting detail.",
            "ar": "حلقة سميكة تمتد من الغطاء كتفصيل بلون متباين."
          },
          "focus": {
            "x": 0.54,
            "y": 0.29,
            "scale": 3.5
          }
        },
        {
          "id": "thread",
          "label": {
            "he": "החיבור הפנימי",
            "en": "Threaded connection",
            "ar": "الوصلة اللولبية"
          },
          "material": {
            "he": "הברגה בגימור מתכתי",
            "en": "Metal-look screw thread",
            "ar": "قلاوظ بمظهر معدني"
          },
          "detail": {
            "he": "פרט הפקק הנפרד מציג את פתח ההברגה ואת שפת החיבור. אין נתוני בידוד מאומתים.",
            "en": "The separate cap detail shows its screw opening and connection rim. Insulation specifications are not verified.",
            "ar": "تفصيل الغطاء المنفصل يبيّن فتحة القلاوظ وحافة الاتصال. مواصفات العزل غير مؤكدة."
          },
          "focus": {
            "x": 0.68,
            "y": 0.74,
            "scale": 3.5
          }
        }
      ],
      "detailImage": "assets/detail/loop.webp",
      "spin": {
        "src": "assets/spin/loop.webp",
        "columns": 4,
        "rows": 3,
        "frames": 12,
        "bounds": {
          "x": [
            0,
            362,
            724,
            1086,
            1448
          ],
          "y": [
            0,
            362,
            724,
            1086
          ]
        },
        "framing": [
          {
            "cx": 198.5,
            "cy": 183,
            "scale": 0.88083
          },
          {
            "cx": 198.5,
            "cy": 182.5,
            "scale": 0.88345
          },
          {
            "cx": 190,
            "cy": 182.5,
            "scale": 0.87822
          },
          {
            "cx": 178,
            "cy": 182.5,
            "scale": 0.87822
          },
          {
            "cx": 180.5,
            "cy": 181.5,
            "scale": 0.87822
          },
          {
            "cx": 168.5,
            "cy": 181,
            "scale": 0.87563
          },
          {
            "cx": 178.5,
            "cy": 181.5,
            "scale": 0.87306
          },
          {
            "cx": 172,
            "cy": 181.5,
            "scale": 0.87306
          },
          {
            "cx": 159.5,
            "cy": 181.5,
            "scale": 0.87306
          },
          {
            "cx": 161.5,
            "cy": 181.5,
            "scale": 0.87306
          },
          {
            "cx": 195.5,
            "cy": 181.5,
            "scale": 0.87306
          },
          {
            "cx": 193,
            "cy": 181.5,
            "scale": 0.87306
          }
        ]
      },
      "new": true,
      "featured": 11,
      "inventory": {
        "sand": {
          "500 ML": 6,
          "750 ML": 7
        },
        "sage": {
          "500 ML": 7,
          "750 ML": 8
        },
        "charcoal": {
          "500 ML": 8,
          "750 ML": 9
        }
      }
    }
  ]
});
