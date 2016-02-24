{
    "name": "market",
    "hasPage": true,
    "views": [
        "menu"
    ],
    "children": [{
        "name": "page",
        "url": "",
        "views": [
            "breadcrumbs",
            "seoContent"
        ]
    }, {
        "name": "pagenotfound",
        "url": "/404"
    }, {
        "name": "search",
        "url": "/sok?text"
    }, {
        "name": "multiview",
        "url": "/multi-vy?{c:[0-9]{1,8}}",
        "views": [
            "leagues"
        ]
    }, {
        "name": "bethistory",
        "url": "/spelhistorik"
    }, {
        "name": "category",
        "hasPage": true,
        "children": [{
            "name": "page",
            "url": "",
            "views": [
                "breadcrumbs",
                "seoContent",
                "pageData"
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
                    "pageData"
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
                        "pageData"
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
                            "pageData"
                        ]
                    }]
                }]
            }]
        }]
    }]
}
