import Vue from 'vue';

var DISPLAY_TYPE;

(function (DISPLAY_TYPE) {
  DISPLAY_TYPE["MAXIMIZE"] = "MAXIMIZE";
  DISPLAY_TYPE["MINIMIZE"] = "MINIMIZE";
})(DISPLAY_TYPE || (DISPLAY_TYPE = {}));

var DISPLAY_THEME_TYPE;

(function (DISPLAY_THEME_TYPE) {
  DISPLAY_THEME_TYPE["DARK"] = "DARK";
  DISPLAY_THEME_TYPE["LIGHT"] = "LIGHT";
})(DISPLAY_THEME_TYPE || (DISPLAY_THEME_TYPE = {}));

var POSITION;

(function (POSITION) {
  POSITION["TOP_LEFT"] = "TOP_LEFT";
  POSITION["TOP_RIGHT"] = "TOP_RIGHT";
  POSITION["BOTTOM_LEFT"] = "BOTTOM_LEFT";
  POSITION["BOTTOM_RIGHT"] = "BOTTOM_RIGHT";
})(POSITION || (POSITION = {}));

var script = /*#__PURE__*/Vue.extend({
  name: "VueJsonPreview",
  // vue component name
  props: {
    data: {
      type: [Object, Array, String, Boolean],
      default: []
    },
    position: {
      type: String,
      default: POSITION.BOTTOM_RIGHT
    }
  },

  data() {
    return {
      display: DISPLAY_TYPE.MAXIMIZE,
      displayTheme: DISPLAY_THEME_TYPE.LIGHT
    };
  },

  computed: {
    class_theme() {
      return {
        "display-theme-dark": this.displayTheme === DISPLAY_THEME_TYPE.DARK,
        "display-theme-light": this.displayTheme === DISPLAY_THEME_TYPE.LIGHT
      };
    },

    object_theme() {
      return {
        light: this.displayTheme === DISPLAY_THEME_TYPE.LIGHT,
        dark: this.displayTheme === DISPLAY_THEME_TYPE.DARK
      };
    },

    viewer_theme() {
      return {
        "viewer-light": this.displayTheme === DISPLAY_THEME_TYPE.LIGHT,
        "viewer-dark": this.displayTheme === DISPLAY_THEME_TYPE.DARK
      };
    },

    label_display() {
      return this.display === DISPLAY_TYPE.MAXIMIZE ? "minimize" : "maximize";
    },

    label_display_theme() {
      return this.displayTheme === DISPLAY_THEME_TYPE.DARK ? "light" : "dark";
    },

    is_display_maximize() {
      return this.display === DISPLAY_TYPE.MAXIMIZE;
    },

    position_style() {
      return {
        "viewer-bottom-right": this.position === POSITION.BOTTOM_RIGHT,
        "viewer-bottom-left": this.position === POSITION.BOTTOM_LEFT,
        "viewer-top-right": this.position === POSITION.TOP_RIGHT,
        "viewer-top-left": this.position === POSITION.TOP_LEFT
      };
    }

  },
  methods: {
    toggleDisplay() {
      if (this.display === DISPLAY_TYPE.MAXIMIZE) {
        this.display = DISPLAY_TYPE.MINIMIZE;
        return;
      }

      if (this.display === DISPLAY_TYPE.MINIMIZE) {
        this.display = DISPLAY_TYPE.MAXIMIZE;
        return;
      }
    },

    toggleTheme() {
      if (this.displayTheme === DISPLAY_THEME_TYPE.DARK) {
        this.displayTheme = DISPLAY_THEME_TYPE.LIGHT;
        return;
      }

      if (this.displayTheme === DISPLAY_THEME_TYPE.LIGHT) {
        this.displayTheme = DISPLAY_THEME_TYPE.DARK;
        return;
      }
    }

  }
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    ref: "viewer",
    class: [_vm.viewer_theme, _vm.position_style],
    attrs: {
      "id": "json-viewer-container"
    }
  }, [_c('div', {
    staticClass: "display-status",
    on: {
      "click": _vm.toggleDisplay
    }
  }, [_c('button', [_vm._v("\n      " + _vm._s(_vm.label_display) + "\n    ")])]), _vm._v(" "), _c('div', {
    class: _vm.class_theme,
    on: {
      "click": _vm.toggleTheme
    }
  }, [_c('button', [_vm._v("\n      " + _vm._s(_vm.label_display_theme) + "\n    ")])]), _vm._v(" "), _vm.is_display_maximize ? _c('div', [Array.isArray(_vm.data) ? [_vm._l(_vm.data, function (item, index) {
    return [_c('div', {
      key: index,
      class: _vm.object_theme
    }, [_c('div', [_vm._v(_vm._s(item.constructor.name))]), _vm._v(" "), _c('div', {
      staticClass: "json-data"
    }, [_vm._v(_vm._s(JSON.stringify(item, null, 4)))]), _vm._v(" "), _c('br')])];
  })] : [_c('div', {
    class: _vm.object_theme
  }, [_c('div', {
    staticClass: "json-data"
  }, [_vm._v(_vm._s(JSON.stringify(_vm.data, null, 4)))])])]], 2) : _vm._e()]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-48257635_0", {
    source: ".display-status[data-v-48257635]{display:inline-block;position:sticky;top:0;right:0}.display-status button[data-v-48257635]{font-family:monospace;background:0 0;background-color:#dd6b20;outline:0;padding-left:.5rem;padding-right:.5rem;border-radius:.3rem;color:#e2e8f0;border:none;padding:.5rem}.display-theme-dark[data-v-48257635]{display:inline-block;position:sticky;margin-left:.3rem;top:0;right:0}.display-theme-dark button[data-v-48257635]{cursor:pointer;font-family:monospace;outline:0;background:0 0;padding-left:.5rem;padding-right:.5rem;border-radius:.3rem;color:#e2e8f0;background-color:#1d1d1d;border:none;padding:.5rem}.display-theme-light[data-v-48257635]{display:inline-block;position:sticky;margin-left:.3rem;top:0;right:0}.display-theme-light button[data-v-48257635]{cursor:pointer;font-family:monospace;outline:0;background:0 0;padding-left:.5rem;padding-right:.5rem;border-radius:.3rem;color:#2d3748;background-color:#fff;border:none;padding:.5rem}.display-theme-dark[data-v-48257635]:hover,.display-theme-light[data-v-48257635]:hover{cursor:pointer}.display-status button[data-v-48257635]:hover{background-color:#fda467;cursor:pointer}.dark[data-v-48257635],.light[data-v-48257635]{border-radius:.5rem;margin-top:1rem;margin-bottom:1rem;padding:.5rem}.dark[data-v-48257635]{background-color:#1d1d1d;box-shadow:#1d1d1d 0 .1rem 1rem}.light[data-v-48257635]{background-color:#f6f6f6;box-shadow:#cacaca 0 .1rem 1rem}.viewer-dark[data-v-48257635],.viewer-light[data-v-48257635]{padding:.9rem;border-radius:.5rem;position:fixed;margin:1rem;max-height:20rem;max-width:40rem;overflow:auto}.json-data[data-v-48257635]{white-space:pre;font-family:monospace}.viewer-bottom-right[data-v-48257635]{bottom:0;right:0}.viewer-bottom-left[data-v-48257635]{bottom:0;left:0}.viewer-top-right[data-v-48257635]{top:0;right:0}.viewer-top-left[data-v-48257635]{top:0;left:0}.viewer-dark[data-v-48257635]{color:#00ff62;background-color:#2d3748}.viewer-light[data-v-48257635]{color:#9e9e9e;background-color:#eaeaea}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-48257635";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var entry_esm = /*#__PURE__*/(() => {
  // Assign InstallableComponent type
  const installable = __vue_component__; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('VueJsonPreview', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export default entry_esm;
