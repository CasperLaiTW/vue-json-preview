'use strict';var Vue=require('vue');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var Vue__default=/*#__PURE__*/_interopDefaultLegacy(Vue);var DISPLAY_TYPE;

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

var script = /*#__PURE__*/Vue__default['default'].extend({
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
});function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group = css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
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
  }, [_vm._ssrNode(_vm.is_display_maximize ? "<div data-v-68c41c8e>" + (Array.isArray(_vm.data) ? _vm._ssrList(_vm.data, function (item, index) {
    return "<div" + _vm._ssrClass(null, _vm.object_theme) + " data-v-68c41c8e><div data-v-68c41c8e>" + _vm._ssrEscape(_vm._s(item.constructor.name)) + "</div> <div class=\"json-data\" data-v-68c41c8e>" + _vm._ssrEscape(_vm._s(JSON.stringify(item, null, 4))) + "</div> <br data-v-68c41c8e></div>";
  }) : "<div" + _vm._ssrClass(null, _vm.object_theme) + " data-v-68c41c8e><div class=\"json-data\" data-v-68c41c8e>" + _vm._ssrEscape(_vm._s(JSON.stringify(_vm.data, null, 4))) + "</div></div>") + "</div>" : "<!---->")]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-68c41c8e_0", {
    source: ".display-status[data-v-68c41c8e]{display:inline-block;position:sticky;top:0;right:0}.display-status button[data-v-68c41c8e]{font-family:monospace;background:0 0;background-color:#dd6b20;outline:0;padding-left:.5rem;padding-right:.5rem;border-radius:.3rem;color:#e2e8f0;border:none;padding:.5rem}.display-theme-dark[data-v-68c41c8e]{display:inline-block;position:sticky;margin-left:.3rem;top:0;right:0}.display-theme-dark button[data-v-68c41c8e]{cursor:pointer;font-family:monospace;outline:0;background:0 0;padding-left:.5rem;padding-right:.5rem;border-radius:.3rem;color:#e2e8f0;background-color:#1d1d1d;border:none;padding:.5rem}.display-theme-light[data-v-68c41c8e]{display:inline-block;position:sticky;margin-left:.3rem;top:0;right:0}.display-theme-light button[data-v-68c41c8e]{cursor:pointer;font-family:monospace;outline:0;background:0 0;padding-left:.5rem;padding-right:.5rem;border-radius:.3rem;color:#2d3748;background-color:#fff;border:none;padding:.5rem}.display-theme-dark[data-v-68c41c8e]:hover,.display-theme-light[data-v-68c41c8e]:hover{cursor:pointer}.display-status button[data-v-68c41c8e]:hover{background-color:#fda467;cursor:pointer}.dark[data-v-68c41c8e],.light[data-v-68c41c8e]{border-radius:.5rem;margin-top:1rem;margin-bottom:1rem;padding:.5rem}.dark[data-v-68c41c8e]{background-color:#1d1d1d;box-shadow:#1d1d1d 0 .1rem 1rem}.light[data-v-68c41c8e]{background-color:#f6f6f6;box-shadow:#cacaca 0 .1rem 1rem}.viewer-dark[data-v-68c41c8e],.viewer-light[data-v-68c41c8e]{padding:.9rem;border-radius:.5rem;position:fixed;margin:1rem;max-height:20rem;max-width:40rem;overflow:auto}.json-data[data-v-68c41c8e]{white-space:pre;font-family:monospace}.viewer-bottom-right[data-v-68c41c8e]{bottom:0;right:0}.viewer-bottom-left[data-v-68c41c8e]{bottom:0;left:0}.viewer-top-right[data-v-68c41c8e]{top:0;right:0}.viewer-top-left[data-v-68c41c8e]{top:0;left:0}.viewer-dark[data-v-68c41c8e]{color:#00ff62;background-color:#2d3748}.viewer-light[data-v-68c41c8e]{color:#9e9e9e;background-color:#eaeaea}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-68c41c8e";
/* module identifier */

const __vue_module_identifier__ = "data-v-68c41c8e";
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var component = /*#__PURE__*/(() => {
  // Assign InstallableComponent type
  const installable = __vue_component__; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('VueJsonPreview', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,'default': component});// iife/cjs usage extends esm default export - so import it all
// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)

Object.entries(namedExports).forEach(([exportName, exported]) => {
  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;