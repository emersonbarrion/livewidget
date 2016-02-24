{
    "name": "market",
    "hasPage": true,
    "views": [
        "menu",
        "initialiseBetslip"
    ],
    "children": [{
        "name": "page",
        "url": "",
        "views": [
            "breadcrumbs",
            "seoContent",
            "homePage"
        ]
    }, {
        "name": "pagenotfound",
        "url": "/404"
    }, {
        "name": "search",
        "url": "/search?text",
        "views": [
            "searchPage"
        ]
    }, {
        "name": "live",
        "url": "/live",
        "views": [
            "liveLobbyPage"
        ],
        "children": [{
            "name": "category",
            "hasPage": true,
            "children": [{
                "name": "page",
                "url": "",
                "views": [
                    "breadcrumbs",
                    "seoContent",
                    "liveTableByCategoryPage"
                ]
            }, {
                "name": "region",
                "hasPage": true,
                "children": [{
                    "name": "page",
                    "url": "",
                    "views": [
                        "breadcrumbs",
                        "seoContent",
                        "liveTableByCategoryPage"
                    ]
                }, {
                    "name": "competition",
                    "hasPage": true,
                    "children": [{
                        "name": "page",
                        "url": "",
                        "views": [
                            "breadcrumbs",
                            "seoContent",
                            "liveTableByCategoryPage"
                        ]
                    }, {
                        "name": "event",
                        "hasPage": true,
                        "children": [{
                            "name": "page",
                            "url": "",
                            "views": [
                                "breadcrumbs",
                                "seoContent",
                                "eventPage"
                            ]
                        }]
                    }]
                }]
            }]
        }]
    }, {
        "name": "multiview",
        "url": "/multi-view?{c:[0-9]{1,8}}",
        "views": [
            "eventListPage"
        ]
    }, {
        "name": "startingsoon",
        "url": "/starting-soon",
        "views": [
            "startingSoonPage"
        ]
    }, {
        "name": "bethistory",
        "url": "/bethistory"
    }, {
        "name": "category",
        "hasPage": true,
        "children": [{
            "name": "page",
            "url": "",
            "views": [
                "breadcrumbs",
                "seoContent",
                "eventListPage"
            ]
        }, {
            "name": "region",
            "hasPage": true,
            "children": [{
                "name": "page",
                "url": "",
                "views": [
                    "breadcrumbs",
                    "seoContent",
                    "eventListPage"
                ]
            }, {
                "name": "competition",
                "hasPage": true,
                "children": [{
                    "name": "page",
                    "url": "",
                    "views": [
                        "breadcrumbs",
                        "seoContent",
                        "eventListPage"
                    ]
                }, {
                    "name": "event",
                    "hasPage": true,
                    "children": [{
                        "name": "page",
                        "url": "",
                        "views": [
                            "breadcrumbs",
                            "seoContent",
                            "eventPage"
                        ]
                    }]
                }]
            }]
        }]
    }]
}
