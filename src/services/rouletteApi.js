// LeeeL's Guide: Weflab Live Roulette Odds Service
(function() {
  const DEFAULT_ROULETTE_DATA = {
  "success": true,
  "streamer": "리엘*",
  "lastModified": "2026년 05월 05일 16시 14분 21초",
  "updatedAt": "2026-09-08T01:10:00Z",
  "categories": [
    {
      "id": "roulette_33_1",
      "count": "33",
      "title": "킬 룰렛",
      "group": "kill",
      "itemCount": 10,
      "items": [
        {
          "name": "꽝",
          "percent": 35.0,
          "percentStr": "35%",
          "type": "텍스트"
        },
        {
          "name": "+3킬",
          "percent": 23.0,
          "percentStr": "23%",
          "type": "계산"
        },
        {
          "name": "+1킬",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "계산"
        },
        {
          "name": "+5킬",
          "percent": 15.0,
          "percentStr": "15%",
          "type": "계산"
        },
        {
          "name": "+7킬",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "계산"
        },
        {
          "name": "+15킬",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "계산"
        },
        {
          "name": "+30킬",
          "percent": 0.5,
          "percentStr": "0.5%",
          "type": "계산"
        },
        {
          "name": "+50킬",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "계산"
        },
        {
          "name": "+100킬",
          "percent": 0.07,
          "percentStr": "0.07%",
          "type": "계산"
        },
        {
          "name": "+1000킬",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "계산"
        }
      ]
    },
    {
      "id": "roulette_333_2",
      "count": "333",
      "title": "킬 룰렛",
      "group": "kill",
      "itemCount": 10,
      "items": [
        {
          "name": "+30킬",
          "percent": 35.0,
          "percentStr": "35%",
          "type": "계산"
        },
        {
          "name": "+50킬",
          "percent": 30.0,
          "percentStr": "30%",
          "type": "계산"
        },
        {
          "name": "+15킬",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "계산"
        },
        {
          "name": "+70킬",
          "percent": 7.0,
          "percentStr": "7%",
          "type": "계산"
        },
        {
          "name": "+150킬",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "계산"
        },
        {
          "name": "+300킬",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "계산"
        },
        {
          "name": "+500킬",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "계산"
        },
        {
          "name": "+1000킬",
          "percent": 0.5,
          "percentStr": "0.5%",
          "type": "계산"
        },
        {
          "name": "킬초방어권",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "+100킬",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "계산"
        }
      ]
    },
    {
      "id": "roulette_34_3",
      "count": "34",
      "title": "실드 룰렛",
      "group": "shield",
      "itemCount": 10,
      "items": [
        {
          "name": "-1000킬",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "텍스트"
        },
        {
          "name": "-3킬",
          "percent": 23.0,
          "percentStr": "23%",
          "type": "계산"
        },
        {
          "name": "-1킬",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "계산"
        },
        {
          "name": "-5킬",
          "percent": 15.0,
          "percentStr": "15%",
          "type": "계산"
        },
        {
          "name": "꽝",
          "percent": 35.0,
          "percentStr": "35%",
          "type": "텍스트"
        },
        {
          "name": "-7킬",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "계산"
        },
        {
          "name": "-15킬",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "계산"
        },
        {
          "name": "-30킬",
          "percent": 0.5,
          "percentStr": "0.5%",
          "type": "계산"
        },
        {
          "name": "-50킬",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "계산"
        },
        {
          "name": "-100킬",
          "percent": 0.07,
          "percentStr": "0.07%",
          "type": "계산"
        }
      ]
    },
    {
      "id": "roulette_334_4",
      "count": "334",
      "title": "실드 룰렛",
      "group": "shield",
      "itemCount": 10,
      "items": [
        {
          "name": "-30킬",
          "percent": 35.0,
          "percentStr": "35%",
          "type": "계산"
        },
        {
          "name": "-50킬",
          "percent": 30.0,
          "percentStr": "30%",
          "type": "계산"
        },
        {
          "name": "-15킬",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "계산"
        },
        {
          "name": "-70킬",
          "percent": 7.0,
          "percentStr": "7%",
          "type": "계산"
        },
        {
          "name": "-150킬",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "계산"
        },
        {
          "name": "-300킬",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "계산"
        },
        {
          "name": "-500킬",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "계산"
        },
        {
          "name": "-1000킬",
          "percent": 0.5,
          "percentStr": "0.5%",
          "type": "계산"
        },
        {
          "name": "킬초기화",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "-100킬",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "계산"
        }
      ]
    },
    {
      "id": "roulette_50_5",
      "count": "50",
      "title": "기본 내전 룰렛",
      "group": "ingame",
      "itemCount": 9,
      "items": [
        {
          "name": "달디달고달디단 꽝",
          "percent": 50.0,
          "percentStr": "50%",
          "type": "텍스트"
        },
        {
          "name": "1회연참권",
          "percent": 15.0,
          "percentStr": "15%",
          "type": "텍스트"
        },
        {
          "name": "선참권",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "노벤권",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "글벤권",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "종일연참권",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "너랑같은팀",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "텍스트"
        },
        {
          "name": "너랑반대팀",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "텍스트"
        },
        {
          "name": "감표전챗사용권",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_121_6",
      "count": "121",
      "title": "고급 내전 룰렛",
      "group": "ingame",
      "itemCount": 11,
      "items": [
        {
          "name": "선참권",
          "percent": 30.0,
          "percentStr": "30%",
          "type": "텍스트"
        },
        {
          "name": "1회연참권",
          "percent": 41.0,
          "percentStr": "41%",
          "type": "텍스트"
        },
        {
          "name": "사다리리롤권",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "종일연참권",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "연참권두개",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "한판더",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "칼바람한판더",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "부라인등록권",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "텍스트"
        },
        {
          "name": "종일같은팀/종일반대팀",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "원하는룰렛",
          "percent": 0.5,
          "percentStr": "0.5%",
          "type": "텍스트"
        },
        {
          "name": "포지션변경권",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_135_7",
      "count": "135",
      "title": "개인 시그니처 룰렛(그것)",
      "group": "sig",
      "itemCount": 8,
      "items": [
        {
          "name": "선참권",
          "percent": 30.0,
          "percentStr": "30%",
          "type": "텍스트"
        },
        {
          "name": "1회연참권",
          "percent": 45.0,
          "percentStr": "45%",
          "type": "텍스트"
        },
        {
          "name": "사다리리롤권",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "종일연참권",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "연참권두개",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "한판더",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "롤체데이",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "옵치데이",
          "percent": 0.02,
          "percentStr": "0.02%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_1421_8",
      "count": "1421",
      "title": "초고급 내전 룰렛",
      "group": "ingame",
      "itemCount": 9,
      "items": [
        {
          "name": "선참10개",
          "percent": 35.0,
          "percentStr": "35%",
          "type": "텍스트"
        },
        {
          "name": "선참5개+연참5개",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        },
        {
          "name": "연참10개",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "종참3개",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "원하는룰렛",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "종참5개",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "종참10개",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "텍스트"
        },
        {
          "name": "종참100개",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "텍스트"
        },
        {
          "name": "선참15개",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_21_9",
      "count": "21",
      "title": "잡다 룰렛",
      "group": "fan",
      "itemCount": 28,
      "items": [
        {
          "name": "꽝",
          "percent": 33.0,
          "percentStr": "33%",
          "type": "텍스트"
        },
        {
          "name": "냐밍",
          "percent": 46.0,
          "percentStr": "46%",
          "type": "텍스트"
        },
        {
          "name": "1회연참권",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "퀵뷰",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "글벤권",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "노벤권",
          "percent": 3.0,
          "percentStr": "3%",
          "type": "텍스트"
        },
        {
          "name": "선참권",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "역팬갑",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "방셀",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "롤친추",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "1회연참권",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "한판더",
          "percent": 0.3,
          "percentStr": "0.3%",
          "type": "텍스트"
        },
        {
          "name": "노휴방실드",
          "percent": 0.3,
          "percentStr": "0.3%",
          "type": "텍스트"
        },
        {
          "name": "캠방권",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "방종실드",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "종일연참권",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "두판더",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "노방종",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "노방종실드",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "세판더",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "네판더",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "킬초",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "텍스트"
        },
        {
          "name": "방종",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "텍스트"
        },
        {
          "name": "노휴방",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "텍스트"
        },
        {
          "name": "+100킬",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "계산"
        },
        {
          "name": "식데",
          "percent": 0.005,
          "percentStr": "0.005%",
          "type": "텍스트"
        },
        {
          "name": "+3킬",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "계산"
        },
        {
          "name": "+5킬",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "계산"
        }
      ]
    },
    {
      "id": "roulette_55_10",
      "count": "55",
      "title": "롤체 룰렛",
      "group": "fan",
      "itemCount": 7,
      "items": [
        {
          "name": "꽝",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        },
        {
          "name": "원하는덱",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "텍스트"
        },
        {
          "name": "원하는아이템",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "텍스트"
        },
        {
          "name": "원하는시너지",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "텍스트"
        },
        {
          "name": "퀵뷰",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "원하는증강",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "원하는등수",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_14121_11",
      "count": "14121",
      "title": "스페셜 룰렛",
      "group": "special",
      "itemCount": 4,
      "items": [
        {
          "name": "식데",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        },
        {
          "name": "종참30개",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        },
        {
          "name": "강제휴방",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        },
        {
          "name": "선참50+연참50",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_321_12",
      "count": "321",
      "title": "개인 시그니처 룰렛(장카)",
      "group": "sig",
      "itemCount": 10,
      "items": [
        {
          "name": "식데",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "텍스트"
        },
        {
          "name": "연참권",
          "percent": 8.0,
          "percentStr": "8%",
          "type": "텍스트"
        },
        {
          "name": "선참권",
          "percent": 15.0,
          "percentStr": "15%",
          "type": "텍스트"
        },
        {
          "name": "종일연참권",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "연참권두개",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "텍스트"
        },
        {
          "name": "연참권+선참권",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "텍스트"
        },
        {
          "name": "선참권두개",
          "percent": 15.0,
          "percentStr": "15%",
          "type": "텍스트"
        },
        {
          "name": "원하는룰렛",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "강제휴방",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "노벤권",
          "percent": 15.0,
          "percentStr": "15%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_221_13",
      "count": "221",
      "title": "한판더 룰렛",
      "group": "ingame",
      "itemCount": 10,
      "items": [
        {
          "name": "한판더",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        },
        {
          "name": "두판더",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "세판더",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "텍스트"
        },
        {
          "name": "네판더",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "열판더",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "선참권",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        },
        {
          "name": "칼바람한판더",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        },
        {
          "name": "칼바람두판더",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "칼바람세판더",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "텍스트"
        },
        {
          "name": "칼바람네판더",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_187_14",
      "count": "187",
      "title": "개인 시그니처 룰렛(회장)",
      "group": "sig",
      "itemCount": 10,
      "items": [
        {
          "name": "1회연참권",
          "percent": 20.0,
          "percentStr": "20%",
          "type": "텍스트"
        },
        {
          "name": "선참권",
          "percent": 25.0,
          "percentStr": "25%",
          "type": "텍스트"
        },
        {
          "name": "글벤권",
          "percent": 16.0,
          "percentStr": "16%",
          "type": "텍스트"
        },
        {
          "name": "노벤권",
          "percent": 16.0,
          "percentStr": "16%",
          "type": "텍스트"
        },
        {
          "name": "한판더",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "두판더",
          "percent": 2.0,
          "percentStr": "2%",
          "type": "텍스트"
        },
        {
          "name": "종참권",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "강제휴방",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "식데",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "텍스트"
        },
        {
          "name": "연참+선참",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_10000_15",
      "count": "10000",
      "title": "우잼 식데 룰렛",
      "group": "special",
      "itemCount": 2,
      "items": [
        {
          "name": "우잼식데",
          "percent": 99.9,
          "percentStr": "99.9%",
          "type": "텍스트"
        },
        {
          "name": "리엘식데",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_421_16",
      "count": "421",
      "title": "팬서비스룰렛",
      "group": "fan",
      "itemCount": 13,
      "items": [
        {
          "name": "캠방합의권",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "방셀",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "시그니처사운드",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "시그니처풍선",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "식데",
          "percent": 0.05,
          "percentStr": "0.05%",
          "type": "텍스트"
        },
        {
          "name": "영데",
          "percent": 0.1,
          "percentStr": "0.1%",
          "type": "텍스트"
        },
        {
          "name": "번호교환",
          "percent": 7.0,
          "percentStr": "7%",
          "type": "텍스트"
        },
        {
          "name": "카톡교환",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "원하는룰렛",
          "percent": 1.0,
          "percentStr": "1%",
          "type": "텍스트"
        },
        {
          "name": "역팬갑",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "종일연참권",
          "percent": 5.0,
          "percentStr": "5%",
          "type": "텍스트"
        },
        {
          "name": "선참권",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        },
        {
          "name": "선참+연참권",
          "percent": 40.0,
          "percentStr": "40%",
          "type": "텍스트"
        }
      ]
    },
    {
      "id": "roulette_200_17",
      "count": "200",
      "title": "듀오 룰렛",
      "group": "ingame",
      "itemCount": 2,
      "items": [
        {
          "name": "듀오권",
          "percent": 90.0,
          "percentStr": "90%",
          "type": "텍스트"
        },
        {
          "name": "1회연참권",
          "percent": 10.0,
          "percentStr": "10%",
          "type": "텍스트"
        }
      ]
    }
  ]
};

  window.RouletteApi = {
    DEFAULT_DATA: DEFAULT_ROULETTE_DATA,

    fetchLiveOdds: async () => {
      try {
        const res = await fetch('/api/roulette');
        if (res.ok) {
          const data = await res.json();
          if (data && data.categories && data.categories.length > 0) {
            console.log('⚡ Loaded live roulette odds from /api/roulette');
            return data;
          }
        }
      } catch (err) {
        console.warn('Live /api/roulette fetch skipped or failed, using embedded weflab data:', err);
      }
      return DEFAULT_ROULETTE_DATA;
    }
  };
})();
