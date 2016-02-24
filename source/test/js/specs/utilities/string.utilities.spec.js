describe('Utilities: String replacement extensions', function() {

    it("Should replace all instances of a substring within a string.", function() {

        expect("Four score and seven years ago. The cat and the mouse".replaceAll("and", "&")).toBe("Four score & seven years ago. The cat & the mouse");
    });

    it("Should populate placeholders with the given values", function () {

        expect("{{category}}/{{region}}/{{competition}}/{{name}}".replaceTemplateVariables("A", "B", "C", "D")).toBe("A/B/C/D");
        expect("{{category}}/{{region}}/{{competition}}/{{name}}".replaceTemplateVariables("A", "B", "C")).toBe("A/B/C/");
        expect("{{category}}/{{region}}/{{competition}}/{{name}}".replaceTemplateVariables("A", "B")).toBe("A/B//");
        expect("{{category}}/{{region}}/{{competition}}/{{name}}".replaceTemplateVariables("A")).toBe("A///");
        expect("{{category}}/{{region}}/{{competition}}/{{name}}".replaceTemplateVariables()).toBe("///");
    });

    it("Should populate arbitrary placeholders with the given values", function () {

        expect("{{category}}/{{region}}/{{competition}}/{{name}}".populate({ category: "A", region: "B", competition: "C", name: "D" })).toBe("A/B/C/D");
        expect("{{category}}/{{wha}}/{{competition}}/{{name}}".populate({ category: "A", wha: "B", competition: "C" })).toBe("A/B/C/");
        expect("{{category}}/{{region}}/{{competition}}/{{name}}".populate({ category: "A", region: "B" })).toBe("A/B//");
        expect("{{category}}/{{region}}/{{competition}}/{{name}}".populate({ category: "A" })).toBe("A///");
        expect("{{category}}/{{region}}/{{competition}}/{{name}}".populate({})).toBe("///");
    });

    it("Should determine if a string ends with a given suffix", function() {

        expect("my test string".endsWith("string")).toBe(true);
        expect("my test string".endsWith("ing")).toBe(true);
        expect("my test string".endsWith("my test string")).toBe(true);
        expect("my test string".endsWith("my")).toBe(false);
        expect("my test string".endsWith("test")).toBe(false);
    });
});