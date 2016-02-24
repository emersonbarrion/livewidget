{
    "multipleEventsTable": {
        "categoryIds": [1, 2],
        "limit": 10
    },
    "liveMultipleEventsTable": {
        "categoryIds": [1, 11, 2, 3, 4, 9, 19, 10, 133],
        "limit": 20
    },
    "winnerLists": {
        "categoryIds": [1, 2, 38],
        "limit": 10
    },
    "mostPopular": {
        "categoryIds": [11, 1, 2, 3, 4, 19],
        "limit": 10
    },
    "startingSoon": {
        "limit": 5,
        "betGroupIds": [1, 27, 5, 15, 36],
        "compositeColumns": [
          {
            "header": "Match Winner",
            "possibleBetGroupIds": [1, 27, 15],
            "columns": [
              {
                "header": "1",
                "selectionsOrderingByBetGroupId": {
                  "1": 1,
                  "27": 1,
                  "15": 1
                },
                "isLine": false
              },
              {
                "header": "X",
                "selectionsOrderingByBetGroupId": {
                  "1": 2,
                  "27": null,
                  "15": null
                },
                "isLine": false
              },
              {
                "header": "2",
                "selectionsOrderingByBetGroupId": {
                  "1": 3,
                  "27": 2,
                  "15": 2
                },
                "isLine": false
              }
            ]
          },

          {
            "header": "Number of Goals",
            "possibleBetGroupIds": [5],
            "columns": [
              {
                "header": "Line",
                "selectionsOrderingByBetGroupId": null,
                "isLine": true
              },
              {
                "header": "Over",
                "selectionsOrderingByBetGroupId": {
                  "5": 1
                },
                "isLine": false
              },
              {
                "header": "Under",
                "selectionsOrderingByBetGroupId": {
                  "5": 2
                },
                "isLine": false
              }
            ]
          }
        ]
    }
}