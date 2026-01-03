module.exports = {
  extends: ["stylelint-config-tailwindcss"],
  plugins: ["stylelint-order"],
  rules: {
    "order/order": [
      [
        {
          type: "at-rule",
          name: "import",
        },
        {
          type: "at-rule",
          name: "plugin",
        },
        {
          type: "at-rule",
          name: "custom-variant",
        },
        {
          type: "at-rule",
          name: "source",
        },
        {
          type: "at-rule",
          name: "layer",
        },
        {
          type: "rule",
        },
        {
          type: "at-rule",
        },
      ],
      {
        unspecified: "bottom",
      },
    ],
  },
};
