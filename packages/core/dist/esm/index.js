import {
  ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT as e,
  useCollector as t,
  wrapConnectorHooks as n,
  ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT as r,
  deprecationWarning as o,
  useEffectOnce as a,
  ERROR_TOP_LEVEL_ELEMENT_NO_ID as i,
  ROOT_NODE as d,
  ERROR_INVALID_NODEID as s,
  ERROR_DELETE_TOP_LEVEL_NODE as u,
  ERROR_NOPARENT as c,
  DEPRECATED_ROOT_NODE as l,
  ERROR_NOT_IN_RESOLVER as f,
  ERROR_INVALID_NODE_ID as p,
  ERROR_MOVE_TOP_LEVEL_NODE as v,
  ERROR_MOVE_NONCANVAS_CHILD as h,
  ERROR_CANNOT_DRAG as g,
  ERROR_MOVE_TO_NONCANVAS_PARENT as y,
  ERROR_MOVE_INCOMING_PARENT as m,
  ERROR_MOVE_CANNOT_DROP as N,
  ERROR_MOVE_TO_DESCENDANT as E,
  ERROR_DUPLICATE_NODEID as O,
  ERROR_MOVE_OUTGOING_PARENT as b,
  getRandomId as C,
  ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER as T,
  getDOMInfo as k,
  EventHandlers as D,
  DerivedEventHandlers as x,
  isChromium as w,
  isLinux as I,
  RenderIndicator as S,
  useMethods as j,
  ERROR_RESOLVER_NOT_AN_OBJECT as q,
  HISTORY_ACTIONS as P,
} from '@craftjs/utils';
export { ROOT_NODE } from '@craftjs/utils';
import L, {
  createContext as R,
  useContext as A,
  useMemo as _,
  useEffect as F,
  useState as z,
  useRef as M,
  Children as H,
  Fragment as B,
} from 'react';
import W from 'tiny-invariant';
import { isFunction as J, pickBy as X } from 'lodash';
import Y from 'lodash/cloneDeep';
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var G = function (
  e,
  t
) {
  return (G =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (e, t) {
        e.__proto__ = t;
      }) ||
    function (e, t) {
      for (var n in t)
        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
    })(e, t);
};
function K(e, t) {
  if ('function' != typeof t && null !== t)
    throw new TypeError(
      'Class extends value ' + String(t) + ' is not a constructor or null'
    );
  function n() {
    this.constructor = e;
  }
  G(e, t),
    (e.prototype =
      null === t ? Object.create(t) : ((n.prototype = t.prototype), new n()));
}
var U = function () {
  return (U =
    Object.assign ||
    function (e) {
      for (var t, n = 1, r = arguments.length; n < r; n++)
        for (var o in (t = arguments[n]))
          Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      return e;
    }).apply(this, arguments);
};
function V(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      t.indexOf(r) < 0 &&
      (n[r] = e[r]);
  if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
    var o = 0;
    for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
        (n[r[o]] = e[r[o]]);
  }
  return n;
}
function Q() {
  for (var e = 0, t = 0, n = arguments.length; t < n; t++)
    e += arguments[t].length;
  var r = Array(e),
    o = 0;
  for (t = 0; t < n; t++)
    for (var a = arguments[t], i = 0, d = a.length; i < d; i++, o++)
      r[o] = a[i];
  return r;
}
var Z = L.createContext(null),
  $ = function (e) {
    var t = e.related;
    return L.createElement(
      Z.Provider,
      { value: { id: e.id, related: void 0 !== t && t } },
      e.children
    );
  },
  ee = R(null),
  te = R(null),
  ne = function () {
    return A(te);
  };
function re(r) {
  var o = ne(),
    a = A(ee);
  W(a, e);
  var i = t(a, r),
    d = _(
      function () {
        return o && o.createConnectorsUsage();
      },
      [o]
    );
  F(
    function () {
      return function () {
        d && d.cleanup();
      };
    },
    [d]
  );
  var s = _(
    function () {
      return d && n(d.connectors);
    },
    [d]
  );
  return U(U({}, i), { connectors: s, inContext: !!a, store: a });
}
function oe(e) {
  var t = A(Z);
  W(t, r);
  var o = t.id,
    a = t.related,
    i = re(function (t) {
      return o && t.nodes[o] && e && e(t.nodes[o]);
    }),
    d = i.actions,
    s = i.connectors,
    u = V(i, ['actions', 'query', 'connectors']),
    c = _(
      function () {
        return n({
          connect: function (e) {
            return s.connect(e, o);
          },
          drag: function (e) {
            return s.drag(e, o);
          },
        });
      },
      [s, o]
    ),
    l = _(
      function () {
        return {
          setProp: function (e, t) {
            t ? d.history.throttle(t).setProp(o, e) : d.setProp(o, e);
          },
          setCustom: function (e, t) {
            t ? d.history.throttle(t).setCustom(o, e) : d.setCustom(o, e);
          },
          setHidden: function (e) {
            return d.setHidden(o, e);
          },
        };
      },
      [d, o]
    );
  return U(U({}, u), {
    id: o,
    related: a,
    inNodeContext: !!t,
    actions: l,
    connectors: c,
  });
}
function ae(e) {
  var t = oe(e),
    n = t.id,
    r = t.related,
    a = t.actions,
    i = t.inNodeContext,
    d = t.connectors,
    s = V(t, ['id', 'related', 'actions', 'inNodeContext', 'connectors']);
  return U(U({}, s), {
    actions: a,
    id: n,
    related: r,
    setProp: function (e, t) {
      return (
        o('useNode().setProp()', { suggest: 'useNode().actions.setProp()' }),
        a.setProp(e, t)
      );
    },
    inNodeContext: i,
    connectors: d,
  });
}
var ie = function (e) {
    var t = e.render,
      n = ae().connectors;
    return 'string' == typeof t.type
      ? (0, n.connect)((0, n.drag)(L.cloneElement(t)))
      : t;
  },
  de = function () {
    var e = oe(function (e) {
        return {
          type: e.data.type,
          props: e.data.props,
          nodes: e.data.nodes,
          hydrationTimestamp: e._hydrationTimestamp,
        };
      }),
      t = e.type,
      n = e.props,
      r = e.nodes;
    return _(
      function () {
        var e = n.children;
        r &&
          r.length > 0 &&
          (e = L.createElement(
            L.Fragment,
            null,
            r.map(function (e) {
              return L.createElement(ue, { id: e, key: e });
            })
          ));
        var o = L.createElement(t, n, e);
        return 'string' == typeof t ? L.createElement(ie, { render: o }) : o;
      },
      [t, n, e.hydrationTimestamp, r]
    );
  },
  se = function (e) {
    var t = e.render,
      n = oe(function (e) {
        return { hidden: e.data.hidden };
      }).hidden,
      r = re(function (e) {
        return { onRender: e.options.onRender };
      }).onRender;
    return n
      ? null
      : L.createElement(r, { render: t || L.createElement(de, null) });
  },
  ue = function (e) {
    return L.createElement(
      $,
      { id: e.id },
      L.createElement(se, { render: e.render })
    );
  },
  ce = { is: 'div', canvas: !1, custom: {}, hidden: !1 },
  le = { is: 'type', canvas: 'isCanvas' };
function fe(e) {
  var t = e.id,
    n = e.children,
    r = V(e, ['id', 'children']),
    o = U(U({}, ce), r).is,
    d = re(),
    s = d.query,
    u = d.actions,
    c = oe(function (e) {
      return { node: { id: e.id, data: e.data } };
    }),
    l = c.node,
    f = c.inNodeContext,
    p = z(null),
    v = p[0],
    h = p[1];
  return (
    a(function () {
      W(!!t, i);
      var e = l.id,
        a = l.data;
      if (f) {
        var d,
          c =
            a.linkedNodes && a.linkedNodes[t] && s.node(a.linkedNodes[t]).get();
        if (c && c.data.type === o) d = c.id;
        else {
          var p = L.createElement(fe, r, n),
            v = s.parseReactElement(p).toNodeTree();
          (d = v.rootNodeId), u.history.ignore().addLinkedNodeFromTree(v, e, t);
        }
        h(d);
      }
    }),
    v ? L.createElement(ue, { id: v }) : null
  );
}
var pe = function () {
  return o('<Canvas />', { suggest: '<Element canvas={true} />' });
};
function Canvas(e) {
  var t = V(e, []);
  return (
    F(function () {
      return pe();
    }, []),
    L.createElement(fe, U({}, t, { canvas: !0 }))
  );
}
var ve,
  he = function () {
    var e = re(function (e) {
      return { timestamp: e.nodes[d] && e.nodes[d]._hydrationTimestamp };
    }).timestamp;
    return e ? L.createElement(ue, { id: d, key: e }) : null;
  },
  ge = function (e) {
    var t = e.children,
      n = e.json,
      r = e.data,
      a = re(),
      i = a.actions,
      s = a.query;
    n && o('<Frame json={...} />', { suggest: '<Frame data={...} />' });
    var u = M({ initialChildren: t, initialData: r || n });
    return (
      F(
        function () {
          var e = u.current,
            t = e.initialChildren,
            n = e.initialData;
          if (n) i.history.ignore().deserialize(n);
          else if (t) {
            var r = L.Children.only(t),
              o = s.parseReactElement(r).toNodeTree(function (e, t) {
                return t === r && (e.id = d), e;
              });
            i.history.ignore().addNodeTree(o);
          }
        },
        [i, s]
      ),
      L.createElement(he, null)
    );
  };
!(function (e) {
  (e[(e.Any = 0)] = 'Any'), (e[(e.Id = 1)] = 'Id'), (e[(e.Obj = 2)] = 'Obj');
})(ve || (ve = {}));
var ye = function (e) {
  return V(e, [
    'addLinkedNodeFromTree',
    'setDOM',
    'setNodeEvent',
    'replaceNodes',
    'reset',
  ]);
};
function me(e) {
  var t = re(e),
    n = t.connectors,
    r = t.actions,
    o = V(t.query, ['deserialize']),
    a = t.store,
    i = V(t, ['connectors', 'actions', 'query', 'store']),
    d = ye(r),
    s = _(
      function () {
        return U(U({}, d), {
          history: U(U({}, d.history), {
            ignore: function () {
              for (var e, t = [], n = 0; n < arguments.length; n++)
                t[n] = arguments[n];
              return ye((e = d.history).ignore.apply(e, t));
            },
            throttle: function () {
              for (var e, t = [], n = 0; n < arguments.length; n++)
                t[n] = arguments[n];
              return ye((e = d.history).throttle.apply(e, t));
            },
          }),
        });
      },
      [d]
    );
  return U({ connectors: n, actions: s, query: o, store: a }, i);
}
function Ne(e) {
  return function (t) {
    return function (n) {
      var r = e ? me(e) : me();
      return L.createElement(t, U({}, r, n));
    };
  };
}
function Ee(e) {
  return function (t) {
    return function (n) {
      var r = ae(e);
      return L.createElement(t, U({}, r, n));
    };
  };
}
var Oe = function (e) {
    return Object.fromEntries
      ? Object.fromEntries(e)
      : e.reduce(function (e, t) {
          var n,
            r = t[0],
            o = t[1];
          return U(U({}, e), (((n = {})[r] = o), n));
        }, {});
  },
  be = function (e, t, n) {
    var r = Array.isArray(t) ? t : [t],
      o = U({ existOnly: !1, idOnly: !1 }, n || {}),
      a = r
        .filter(function (e) {
          return !!e;
        })
        .map(function (t) {
          return 'string' == typeof t
            ? { node: e[t], exists: !!e[t] }
            : 'object' != typeof t || o.idOnly
            ? { node: null, exists: !1 }
            : { node: t, exists: !!e[t.id] };
        });
    return (
      o.existOnly &&
        W(
          0 ===
            a.filter(function (e) {
              return !e.exists;
            }).length,
          s
        ),
      a
    );
  },
  Ce = function (e, t) {
    var n = t.name || t.displayName,
      r = (function () {
        if (e[n]) return n;
        for (var r = 0; r < Object.keys(e).length; r++) {
          var o = Object.keys(e)[r];
          if (e[o] === t) return o;
        }
        return 'string' == typeof t ? t : void 0;
      })();
    return W(r, f.replace('%node_type%', n)), r;
  },
  Te = function (e, t) {
    return 'string' == typeof e ? e : { resolvedName: Ce(t, e) };
  },
  ke = function (e, t) {
    var n = e.type,
      r = e.isCanvas,
      o = e.props;
    return (
      (o = Object.keys(o).reduce(function (e, n) {
        var r = o[n];
        return null == r
          ? e
          : ((e[n] =
              'children' === n && 'string' != typeof r
                ? H.map(r, function (e) {
                    return 'string' == typeof e ? e : ke(e, t);
                  })
                : r.type
                ? ke(r, t)
                : r),
            e);
      }, {})),
      { type: Te(n, t), isCanvas: !!r, props: o }
    );
  },
  De = function (e, t) {
    var n = e.type,
      r = e.props,
      o = e.isCanvas,
      a = V(e, ['type', 'props', 'isCanvas', 'name']),
      i = ke({ type: n, isCanvas: o, props: r }, t);
    return U(U({}, i), a);
  };
function xe(e, t) {
  W('string' == typeof t, p);
  var n = e.nodes[t],
    r = function (t) {
      return xe(e, t);
    };
  return {
    isCanvas: function () {
      return !!n.data.isCanvas;
    },
    isRoot: function () {
      return n.id === d;
    },
    isLinkedNode: function () {
      return n.data.parent && r(n.data.parent).linkedNodes().includes(n.id);
    },
    isTopLevelNode: function () {
      return this.isRoot() || this.isLinkedNode();
    },
    isDeletable: function () {
      return !this.isTopLevelNode();
    },
    isParentOfTopLevelNodes: function () {
      return n.data.linkedNodes && Object.keys(n.data.linkedNodes).length > 0;
    },
    isParentOfTopLevelCanvas: function () {
      return (
        o('query.node(id).isParentOfTopLevelCanvas', {
          suggest: 'query.node(id).isParentOfTopLevelNodes',
        }),
        this.isParentOfTopLevelNodes()
      );
    },
    isSelected: function () {
      return e.events.selected.has(t);
    },
    isHovered: function () {
      return e.events.hovered.has(t);
    },
    isDragged: function () {
      return e.events.dragged.has(t);
    },
    get: function () {
      return n;
    },
    ancestors: function (t) {
      return (
        void 0 === t && (t = !1),
        (function n(r, o, a) {
          void 0 === o && (o = []), void 0 === a && (a = 0);
          var i = e.nodes[r];
          return i
            ? (o.push(r),
              i.data.parent
                ? ((t || (!t && 0 === a)) && (o = n(i.data.parent, o, a + 1)),
                  o)
                : o)
            : o;
        })(n.data.parent)
      );
    },
    descendants: function (n, o) {
      return (
        void 0 === n && (n = !1),
        (function t(a, i, d) {
          return (
            void 0 === i && (i = []),
            void 0 === d && (d = 0),
            (n || (!n && 0 === d)) && e.nodes[a]
              ? ('childNodes' !== o &&
                  r(a)
                    .linkedNodes()
                    .forEach(function (e) {
                      i.push(e), (i = t(e, i, d + 1));
                    }),
                'linkedNodes' !== o &&
                  r(a)
                    .childNodes()
                    .forEach(function (e) {
                      i.push(e), (i = t(e, i, d + 1));
                    }),
                i)
              : i
          );
        })(t)
      );
    },
    linkedNodes: function () {
      return Object.values(n.data.linkedNodes || {});
    },
    childNodes: function () {
      return n.data.nodes || [];
    },
    isDraggable: function (t) {
      try {
        var o = n;
        return (
          W(!this.isTopLevelNode(), v),
          W(xe(e, o.data.parent).isCanvas(), h),
          W(o.rules.canDrag(o, r), g),
          !0
        );
      } catch (e) {
        return t && t(e), !1;
      }
    },
    isDroppable: function (t, o) {
      var a = be(e.nodes, t),
        i = n;
      try {
        W(this.isCanvas(), y),
          W(
            i.rules.canMoveIn(
              a.map(function (e) {
                return e.node;
              }),
              i,
              r
            ),
            m
          );
        var d = {};
        return (
          a.forEach(function (t) {
            var n = t.node,
              o = t.exists;
            if ((W(n.rules.canDrop(i, n, r), N), o)) {
              W(!r(n.id).isTopLevelNode(), v);
              var a = r(n.id).descendants(!0);
              W(!a.includes(i.id) && i.id !== n.id, E);
              var s = n.data.parent && e.nodes[n.data.parent];
              W(s.data.isCanvas, h),
                W(s || (!s && !e.nodes[n.id]), O),
                s.id !== i.id && (d[s.id] || (d[s.id] = []), d[s.id].push(n));
            }
          }),
          Object.keys(d).forEach(function (t) {
            var n = e.nodes[t];
            W(n.rules.canMoveOut(d[t], n, r), b);
          }),
          !0
        );
      } catch (e) {
        return o && o(e), !1;
      }
    },
    toSerializedNode: function () {
      return De(n.data, e.options.resolver);
    },
    toNodeTree: function (e) {
      var n = Q([t], this.descendants(!0, e)).reduce(function (e, t) {
        return (e[t] = r(t).get()), e;
      }, {});
      return { rootNodeId: t, nodes: n };
    },
    decendants: function (e) {
      return (
        void 0 === e && (e = !1),
        o('query.node(id).decendants', {
          suggest: 'query.node(id).descendants',
        }),
        this.descendants(e)
      );
    },
    isTopLevelCanvas: function () {
      return !this.isRoot() && !n.data.parent;
    },
  };
}
function we(e, t, n, r) {
  for (
    var o = { parent: e, index: 0, where: 'before' },
      a = 0,
      i = 0,
      d = 0,
      s = 0,
      u = 0,
      c = 0,
      l = 0,
      f = t.length;
    l < f;
    l++
  ) {
    var p = t[l];
    if (
      ((c = p.top + p.outerHeight),
      (s = p.left + p.outerWidth / 2),
      (u = p.top + p.outerHeight / 2),
      !((i && p.left > i) || (d && u >= d) || (a && p.left + p.outerWidth < a)))
    )
      if (((o.index = l), p.inFlow)) {
        if (r < u) {
          o.where = 'before';
          break;
        }
        o.where = 'after';
      } else
        r < c && (d = c),
          n < s
            ? ((i = s), (o.where = 'before'))
            : ((a = s), (o.where = 'after'));
  }
  return o;
}
var Ie = function (e) {
  return 'string' == typeof e ? e : e.name;
};
function Se(e, t) {
  var n = e.data.type,
    r = {
      id: e.id || C(),
      _hydrationTimestamp: Date.now(),
      data: U(
        {
          type: n,
          name: Ie(n),
          displayName: Ie(n),
          props: {},
          custom: {},
          parent: null,
          isCanvas: !1,
          hidden: !1,
          nodes: [],
          linkedNodes: {},
        },
        e.data
      ),
      related: {},
      events: { selected: !1, dragged: !1, hovered: !1 },
      rules: {
        canDrag: function () {
          return !0;
        },
        canDrop: function () {
          return !0;
        },
        canMoveIn: function () {
          return !0;
        },
        canMoveOut: function () {
          return !0;
        },
      },
      dom: null,
    };
  if (r.data.type === fe || r.data.type === Canvas) {
    var o = U(U({}, ce), r.data.props);
    (r.data.props = Object.keys(r.data.props).reduce(function (e, t) {
      return (
        Object.keys(ce).includes(t)
          ? (r.data[le[t] || t] = o[t])
          : (e[t] = r.data.props[t]),
        e
      );
    }, {})),
      (r.data.name = Ie((n = r.data.type))),
      (r.data.displayName = Ie(n)),
      r.data.type === Canvas && ((r.data.isCanvas = !0), pe());
  }
  t && t(r);
  var a = n.craft;
  if (
    a &&
    ((r.data.displayName = a.displayName || a.name || r.data.displayName),
    (r.data.props = U(U({}, a.props || a.defaultProps || {}), r.data.props)),
    (r.data.custom = U(U({}, a.custom || {}), r.data.custom)),
    null != a.isCanvas && (r.data.isCanvas = a.isCanvas),
    a.rules &&
      Object.keys(a.rules).forEach(function (e) {
        ['canDrag', 'canDrop', 'canMoveIn', 'canMoveOut'].includes(e) &&
          (r.rules[e] = a.rules[e]);
      }),
    a.related)
  ) {
    var i = { id: r.id, related: !0 };
    Object.keys(a.related).forEach(function (e) {
      r.related[e] = function () {
        return L.createElement($, i, L.createElement(a.related[e]));
      };
    });
  }
  return r;
}
var je = function (e, t, n) {
    var r = e.props,
      o = (function (e, t) {
        return 'object' == typeof e && e.resolvedName
          ? 'Canvas' === e.resolvedName
            ? Canvas
            : t[e.resolvedName]
          : 'string' == typeof e
          ? e
          : null;
      })(e.type, t);
    if (o) {
      (r = Object.keys(r).reduce(function (e, n) {
        var o = r[n];
        return (
          (e[n] =
            null == o
              ? null
              : 'object' == typeof o && o.resolvedName
              ? je(o, t)
              : 'children' === n && Array.isArray(o)
              ? o.map(function (e) {
                  return 'string' == typeof e ? e : je(e, t);
                })
              : o),
          e
        );
      }, {})),
        n && (r.key = n);
      var a = U({}, L.createElement(o, U({}, r)));
      return U(U({}, a), { name: Ce(t, a.type) });
    }
  },
  qe = function (e, t) {
    var n = e.type,
      r = V(e, ['type', 'props']);
    W(
      (void 0 !== n && 'string' == typeof n) ||
        (void 0 !== n && void 0 !== n.resolvedName),
      T.replace('%displayName%', e.displayName).replace(
        '%availableComponents%',
        Object.keys(t).join(', ')
      )
    );
    var o = je(e, t),
      a = o.name;
    return {
      type: o.type,
      name: a,
      displayName: r.displayName || a,
      props: o.props,
      custom: r.custom || {},
      isCanvas: !!r.isCanvas,
      hidden: !!r.hidden,
      parent: r.parent,
      linkedNodes: r.linkedNodes || r._childCanvas || {},
      nodes: r.nodes || [],
    };
  },
  Pe = function (e, t) {
    var n, r;
    if (t.length < 1) return ((n = {})[e.id] = e), n;
    var o = t.map(function (e) {
        return e.rootNodeId;
      }),
      a = U(U({}, e), { data: U(U({}, e.data), { nodes: o }) }),
      i = (((r = {})[e.id] = a), r);
    return t.reduce(function (t, n) {
      var r,
        o = n.nodes[n.rootNodeId];
      return U(
        U(U({}, t), n.nodes),
        (((r = {})[o.id] = U(U({}, o), {
          data: U(U({}, o.data), { parent: e.id }),
        })),
        r)
      );
    }, i);
  },
  Le = function (e, t) {
    return { rootNodeId: e.id, nodes: Pe(e, t) };
  };
function Re(e) {
  var t = e && e.options,
    n = function () {
      return Re(e);
    };
  return {
    getDropPlaceholder: function (t, r, o, a) {
      void 0 === a &&
        (a = function (t) {
          return e.nodes[t.id].dom;
        });
      var i = e.nodes[r],
        d = n().node(i.id).isCanvas() ? i : e.nodes[i.data.parent];
      if (d) {
        var s = d.data.nodes || [],
          u = we(
            d,
            s
              ? s.reduce(function (t, n) {
                  var r = a(e.nodes[n]);
                  if (r) {
                    var o = U({ id: n }, k(r));
                    t.push(o);
                  }
                  return t;
                }, [])
              : [],
            o.x,
            o.y
          ),
          c = s.length && e.nodes[s[u.index]],
          l = { placement: U(U({}, u), { currentNode: c }), error: null };
        return (
          be(e.nodes, t).forEach(function (e) {
            var t = e.node;
            e.exists &&
              n()
                .node(t.id)
                .isDraggable(function (e) {
                  return (l.error = e);
                });
          }),
          n()
            .node(d.id)
            .isDroppable(t, function (e) {
              return (l.error = e);
            }),
          l
        );
      }
    },
    getOptions: function () {
      return t;
    },
    getNodes: function () {
      return e.nodes;
    },
    node: function (t) {
      return xe(e, t);
    },
    getSerializedNodes: function () {
      var t = this,
        n = Object.keys(e.nodes).map(function (e) {
          return [e, t.node(e).toSerializedNode()];
        });
      return Oe(n);
    },
    getEvent: function (t) {
      return (function (e, t) {
        var n = e.events[t];
        return {
          contains: function (e) {
            return n.has(e);
          },
          isEmpty: function () {
            return 0 === this.all().length;
          },
          first: function () {
            return this.all()[0];
          },
          last: function () {
            var e = this.all();
            return e[e.length - 1];
          },
          all: function () {
            return Array.from(n);
          },
          size: function () {
            return this.all().length;
          },
          at: function (e) {
            return this.all()[e];
          },
          raw: function () {
            return n;
          },
        };
      })(e, t);
    },
    serialize: function () {
      return JSON.stringify(this.getSerializedNodes());
    },
    parseReactElement: function (t) {
      return {
        toNodeTree: function (r) {
          var o = (function (e, t) {
              var n = e;
              return (
                'string' == typeof n && (n = L.createElement(B, {}, n)),
                Se({ data: { type: n.type, props: U({}, n.props) } }, function (
                  e
                ) {
                  t && t(e, n);
                })
              );
            })(t, function (t, n) {
              var o = Ce(e.options.resolver, t.data.type);
              (t.data.displayName = t.data.displayName || o),
                (t.data.name = o),
                r && r(t, n);
            }),
            a = [];
          return (
            t.props &&
              t.props.children &&
              (a = L.Children.toArray(t.props.children).reduce(function (e, t) {
                return (
                  L.isValidElement(t) &&
                    e.push(n().parseReactElement(t).toNodeTree(r)),
                  e
                );
              }, [])),
            Le(o, a)
          );
        },
      };
    },
    parseSerializedNode: function (t) {
      return {
        toNode: function (r) {
          var a = qe(t, e.options.resolver);
          W(a.type, f);
          var i = 'string' == typeof r && r;
          return (
            i &&
              o('query.parseSerializedNode(...).toNode(id)', {
                suggest:
                  'query.parseSerializedNode(...).toNode(node => node.id = id)',
              }),
            n()
              .parseFreshNode(U(U({}, i ? { id: i } : {}), { data: a }))
              .toNode(!i && r)
          );
        },
      };
    },
    parseFreshNode: function (t) {
      return {
        toNode: function (n) {
          return Se(t, function (t) {
            t.data.parent === l && (t.data.parent = d);
            var r = Ce(e.options.resolver, t.data.type);
            W(null !== r, f),
              (t.data.displayName = t.data.displayName || r),
              (t.data.name = r),
              n && n(t);
          });
        },
      };
    },
    createNode: function (e, t) {
      o('query.createNode(' + e + ')', {
        suggest: 'query.parseReactElement(' + e + ').toNodeTree()',
      });
      var n = this.parseReactElement(e).toNodeTree(),
        r = n.nodes[n.rootNodeId];
      return t
        ? (t.id && (r.id = t.id),
          t.data && (r.data = U(U({}, r.data), t.data)),
          r)
        : r;
    },
    getState: function () {
      return e;
    },
  };
}
var Ae = (function (e) {
    function t() {
      return (null !== e && e.apply(this, arguments)) || this;
    }
    return (
      K(t, e),
      (t.prototype.handlers = function () {
        return {
          connect: function (e, t) {},
          select: function (e, t) {},
          hover: function (e, t) {},
          drag: function (e, t) {},
          drop: function (e, t) {},
          create: function (e, t, n) {},
        };
      }),
      t
    );
  })(D),
  _e = (function (e) {
    function t() {
      return (null !== e && e.apply(this, arguments)) || this;
    }
    return K(t, e), t;
  })(x),
  Fe = (function () {
    function e(e, t) {
      (this.store = e),
        (this.dragTarget = t),
        (this.currentIndicator = null),
        (this.currentDropTargetId = null),
        (this.currentDropTargetCanvasAncestorId = null),
        (this.currentTargetId = null),
        (this.currentTargetChildDimensions = null),
        (this.currentIndicator = null),
        (this.dragError = null),
        (this.draggedNodes = this.getDraggedNodes()),
        this.validateDraggedNodes(),
        (this.onScrollListener = this.onScroll.bind(this)),
        window.addEventListener('scroll', this.onScrollListener, !0);
    }
    return (
      (e.prototype.cleanup = function () {
        window.removeEventListener('scroll', this.onScrollListener, !0);
      }),
      (e.prototype.onScroll = function (e) {
        var t = e.target,
          n = this.store.query.node(d).get();
        t instanceof Element &&
          n &&
          n.dom &&
          t.contains(n.dom) &&
          (this.currentTargetChildDimensions = null);
      }),
      (e.prototype.getDraggedNodes = function () {
        return be(
          this.store.query.getNodes(),
          'new' === this.dragTarget.type
            ? this.dragTarget.tree.nodes[this.dragTarget.tree.rootNodeId]
            : this.dragTarget.nodes
        );
      }),
      (e.prototype.validateDraggedNodes = function () {
        var e = this;
        'new' !== this.dragTarget.type &&
          this.draggedNodes.forEach(function (t) {
            t.exists &&
              e.store.query.node(t.node.id).isDraggable(function (t) {
                e.dragError = t;
              });
          });
      }),
      (e.prototype.isNearBorders = function (t, n, r) {
        return (
          t.top + e.BORDER_OFFSET > r ||
          t.bottom - e.BORDER_OFFSET < r ||
          t.left + e.BORDER_OFFSET > n ||
          t.right - e.BORDER_OFFSET < n
        );
      }),
      (e.prototype.isDiff = function (e) {
        return (
          !this.currentIndicator ||
          this.currentIndicator.placement.parent.id !== e.parent.id ||
          this.currentIndicator.placement.index !== e.index ||
          this.currentIndicator.placement.where !== e.where
        );
      }),
      (e.prototype.getChildDimensions = function (e) {
        var t = this,
          n = this.currentTargetChildDimensions;
        return this.currentTargetId === e.id && n
          ? n
          : e.data.nodes.reduce(function (e, n) {
              var r = t.store.query.node(n).get().dom;
              return r && e.push(U({ id: n }, k(r))), e;
            }, []);
      }),
      (e.prototype.getCanvasAncestor = function (e) {
        var t = this;
        if (
          e === this.currentDropTargetId &&
          this.currentDropTargetCanvasAncestorId
        ) {
          var n = this.store.query
            .node(this.currentDropTargetCanvasAncestorId)
            .get();
          if (n) return n;
        }
        var r = function (e) {
          var n = t.store.query.node(e).get();
          return n && n.data.isCanvas
            ? n
            : n.data.parent
            ? r(n.data.parent)
            : null;
        };
        return r(e);
      }),
      (e.prototype.computeIndicator = function (e, t, n) {
        var r = this.getCanvasAncestor(e);
        if (
          r &&
          ((this.currentDropTargetId = e),
          (this.currentDropTargetCanvasAncestorId = r.id),
          r.data.parent &&
            this.isNearBorders(k(r.dom), t, n) &&
            !this.store.query.node(r.id).isLinkedNode() &&
            (r = this.store.query.node(r.data.parent).get()),
          r)
        ) {
          (this.currentTargetChildDimensions = this.getChildDimensions(r)),
            (this.currentTargetId = r.id);
          var o = we(r, this.currentTargetChildDimensions, t, n);
          if (this.isDiff(o)) {
            var a = this.dragError;
            a ||
              this.store.query.node(r.id).isDroppable(
                this.draggedNodes.map(function (e) {
                  return e.node;
                }),
                function (e) {
                  a = e;
                }
              );
            var i = r.data.nodes[o.index],
              d = i && this.store.query.node(i).get();
            return (
              (this.currentIndicator = {
                placement: U(U({}, o), { currentNode: d }),
                error: a,
              }),
              this.currentIndicator
            );
          }
        }
      }),
      (e.prototype.getIndicator = function () {
        return this.currentIndicator;
      }),
      (e.BORDER_OFFSET = 10),
      e
    );
  })(),
  ze = function (e, t, n) {
    if ((void 0 === n && (n = !1), 1 === t.length || n)) {
      var r = t[0].getBoundingClientRect(),
        o = r.width,
        a = r.height,
        i = t[0].cloneNode(!0);
      return (
        (i.style.position = 'fixed'),
        (i.style.left = '-100%'),
        (i.style.top = '-100%'),
        (i.style.width = o + 'px'),
        (i.style.height = a + 'px'),
        (i.style.pointerEvents = 'none'),
        document.body.appendChild(i),
        e.dataTransfer.setDragImage(i, 0, 0),
        i
      );
    }
    var d = document.createElement('div');
    return (
      (d.style.position = 'fixed'),
      (d.style.left = '-100%'),
      (d.style.top = '-100%'),
      (d.style.width = '100%'),
      (d.style.height = '100%'),
      (d.style.pointerEvents = 'none'),
      t.forEach(function (e) {
        var t = e.getBoundingClientRect(),
          n = t.width,
          r = t.height,
          o = t.top,
          a = t.left,
          i = e.cloneNode(!0);
        (i.style.position = 'absolute'),
          (i.style.left = a + 'px'),
          (i.style.top = o + 'px'),
          (i.style.width = n + 'px'),
          (i.style.height = r + 'px'),
          d.appendChild(i);
      }),
      document.body.appendChild(d),
      e.dataTransfer.setDragImage(d, e.clientX, e.clientY),
      d
    );
  },
  Me = (function (e) {
    function t() {
      var t = (null !== e && e.apply(this, arguments)) || this;
      return (t.positioner = null), (t.currentSelectedElementIds = []), t;
    }
    return (
      K(t, e),
      (t.prototype.onDisable = function () {
        this.options.store.actions.clearEvents();
      }),
      (t.prototype.handlers = function () {
        var e = this,
          n = this.options.store;
        return {
          connect: function (t, r) {
            return (
              n.actions.setDOM(r, t),
              e.reflect(function (e) {
                e.select(t, r), e.hover(t, r), e.drop(t, r);
              })
            );
          },
          select: function (t, r) {
            var o = e.addCraftEventListener(t, 'mousedown', function (t) {
                t.craft.stopPropagation();
                var o = [];
                if (r) {
                  var a = n.query,
                    i = a.getEvent('selected').all();
                  (e.options.isMultiSelectEnabled(t) || i.includes(r)) &&
                    (o = i.filter(function (e) {
                      var t = a.node(e).descendants(!0),
                        n = a.node(e).ancestors(!0);
                      return !t.includes(r) && !n.includes(r);
                    })),
                    o.includes(r) || o.push(r);
                }
                n.actions.setNodeEvent('selected', o);
              }),
              a = e.addCraftEventListener(t, 'click', function (t) {
                t.craft.stopPropagation();
                var o = n.query.getEvent('selected').all(),
                  a = e.options.isMultiSelectEnabled(t),
                  i = e.currentSelectedElementIds.includes(r),
                  d = Q(o);
                a && i
                  ? (d.splice(d.indexOf(r), 1),
                    n.actions.setNodeEvent('selected', d))
                  : !a &&
                    o.length > 1 &&
                    n.actions.setNodeEvent('selected', (d = [r])),
                  (e.currentSelectedElementIds = d);
              });
            return function () {
              o(), a();
            };
          },
          hover: function (t, r) {
            var o = e.addCraftEventListener(t, 'mouseover', function (e) {
              e.craft.stopPropagation(), n.actions.setNodeEvent('hovered', r);
            });
            return function () {
              o();
            };
          },
          drop: function (t, r) {
            var o = e.addCraftEventListener(t, 'dragover', function (t) {
                if (
                  (t.craft.stopPropagation(), t.preventDefault(), e.positioner)
                ) {
                  var o = e.positioner.computeIndicator(
                    r,
                    t.clientX,
                    t.clientY
                  );
                  o && n.actions.setIndicator(o);
                }
              }),
              a = e.addCraftEventListener(t, 'dragenter', function (e) {
                e.craft.stopPropagation(), e.preventDefault();
              });
            return function () {
              a(), o();
            };
          },
          drag: function (r, o) {
            if (!n.query.node(o).isDraggable()) return function () {};
            r.setAttribute('draggable', 'true');
            var a = e.addCraftEventListener(r, 'dragstart', function (r) {
                r.craft.stopPropagation();
                var o = n.query,
                  a = n.actions,
                  i = o.getEvent('selected').all();
                a.setNodeEvent('dragged', i);
                var d = i.map(function (e) {
                  return o.node(e).get().dom;
                });
                (e.draggedElementShadow = ze(r, d, t.forceSingleDragShadow)),
                  (e.dragTarget = { type: 'existing', nodes: i }),
                  (e.positioner = new Fe(e.options.store, e.dragTarget));
              }),
              i = e.addCraftEventListener(r, 'dragend', function (t) {
                t.craft.stopPropagation(),
                  e.dropElement(function (e, t) {
                    'new' !== e.type &&
                      n.actions.move(
                        e.nodes,
                        t.placement.parent.id,
                        t.placement.index +
                          ('after' === t.placement.where ? 1 : 0)
                      );
                  });
              });
            return function () {
              r.setAttribute('draggable', 'false'), a(), i();
            };
          },
          create: function (r, o, a) {
            r.setAttribute('draggable', 'true');
            var i = e.addCraftEventListener(r, 'dragstart', function (r) {
                r.craft.stopPropagation();
                var a = n.query.parseReactElement(o).toNodeTree();
                (e.draggedElementShadow = ze(
                  r,
                  [r.currentTarget],
                  t.forceSingleDragShadow
                )),
                  (e.dragTarget = { type: 'new', tree: a }),
                  (e.positioner = new Fe(e.options.store, e.dragTarget));
              }),
              d = e.addCraftEventListener(r, 'dragend', function (t) {
                t.craft.stopPropagation(),
                  e.dropElement(function (e, t) {
                    'existing' !== e.type &&
                      (n.actions.addNodeTree(
                        e.tree,
                        t.placement.parent.id,
                        t.placement.index +
                          ('after' === t.placement.where ? 1 : 0)
                      ),
                      a && J(a.onCreate) && a.onCreate(e.tree));
                  });
              });
            return function () {
              r.removeAttribute('draggable'), i(), d();
            };
          },
        };
      }),
      (t.prototype.dropElement = function (e) {
        var t = this.options.store;
        if (this.positioner) {
          var n = this.draggedElementShadow,
            r = this.positioner.getIndicator();
          this.dragTarget && r && !r.error && e(this.dragTarget, r),
            n &&
              (n.parentNode.removeChild(n), (this.draggedElementShadow = null)),
            (this.dragTarget = null),
            t.actions.setIndicator(null),
            t.actions.setNodeEvent('dragged', null),
            this.positioner.cleanup(),
            (this.positioner = null);
        }
      }),
      (t.forceSingleDragShadow = w() && I()),
      t
    );
  })(Ae);
function He(e, t, n, r) {
  void 0 === r && (r = 2);
  var o = 0,
    a = 0,
    i = 0,
    d = 0,
    s = e.where;
  return (
    n
      ? n.inFlow
        ? ((i = n.outerWidth),
          (d = r),
          (o = 'before' === s ? n.top : n.bottom),
          (a = n.left))
        : ((i = r),
          (d = n.outerHeight),
          (o = n.top),
          (a = 'before' === s ? n.left : n.left + n.outerWidth))
      : t &&
        ((o = t.top + t.padding.top),
        (a = t.left + t.padding.left),
        (i =
          t.outerWidth -
          t.padding.right -
          t.padding.left -
          t.margin.left -
          t.margin.right),
        (d = r)),
    { top: o + 'px', left: a + 'px', width: i + 'px', height: d + 'px' }
  );
}
var Be = function () {
    var e = re(function (e) {
        return {
          indicator: e.indicator,
          indicatorOptions: e.options.indicator,
          enabled: e.options.enabled,
        };
      }),
      t = e.indicator,
      n = e.indicatorOptions,
      r = e.enabled,
      o = ne();
    return (
      F(
        function () {
          o && (r ? o.enable() : o.disable());
        },
        [r, o]
      ),
      t
        ? L.createElement(S, {
            style: U(
              U(
                {},
                He(
                  t.placement,
                  k(t.placement.parent.dom),
                  t.placement.currentNode && k(t.placement.currentNode.dom),
                  n.thickness
                )
              ),
              {
                backgroundColor: t.error ? n.error : n.success,
                transition: n.transition || '0.2s ease-in',
              }
            ),
            parentDom: t.placement.parent.dom,
          })
        : null
    );
  },
  We = function (e) {
    var t = e.children,
      n = A(ee),
      r = _(
        function () {
          return n.query.getOptions().handlers(n);
        },
        [n]
      );
    return r
      ? L.createElement(te.Provider, { value: r }, L.createElement(Be, null), t)
      : null;
  },
  Je = {
    nodes: {},
    events: { dragged: new Set(), selected: new Set(), hovered: new Set() },
    indicator: null,
    handlers: null,
    options: {
      onNodesChange: function () {
        return null;
      },
      onRender: function (e) {
        return e.render;
      },
      resolver: {},
      enabled: !0,
      indicator: { error: 'red', success: 'rgb(98, 196, 98)' },
      handlers: function (e) {
        return new Me({
          store: e,
          isMultiSelectEnabled: function (e) {
            return !!e.metaKey;
          },
        });
      },
      normalizeNodes: function () {},
    },
  },
  Xe = {
    methods: function (e, t) {
      return U(
        U(
          {},
          (function (e, t) {
            var n = function (t, n, o) {
                var a = function (n, r) {
                  var o = t.nodes[n];
                  'string' != typeof o.data.type &&
                    W(
                      e.options.resolver[o.data.name],
                      f.replace('%node_type%', '' + o.data.type.name)
                    ),
                    (e.nodes[n] = U(U({}, o), {
                      data: U(U({}, o.data), { parent: r }),
                    })),
                    o.data.nodes.length > 0 &&
                      (delete e.nodes[n].data.props.children,
                      o.data.nodes.forEach(function (e) {
                        return a(e, o.id);
                      })),
                    Object.values(o.data.linkedNodes).forEach(function (e) {
                      return a(e, o.id);
                    });
                };
                if ((a(t.rootNodeId, n), n)) {
                  var i = r(n);
                  if ('child' !== o.type)
                    i.data.linkedNodes[o.id] = t.rootNodeId;
                  else {
                    var s = o.index;
                    null != s
                      ? i.data.nodes.splice(s, 0, t.rootNodeId)
                      : i.data.nodes.push(t.rootNodeId);
                  }
                } else
                  W(
                    t.rootNodeId === d,
                    'Cannot add non-root Node without a parent'
                  );
              },
              r = function (t) {
                W(t, c);
                var n = e.nodes[t];
                return W(n, s), n;
              },
              a = function (t) {
                var n = e.nodes[t],
                  r = e.nodes[n.data.parent];
                if (
                  (n.data.nodes &&
                    Q(n.data.nodes).forEach(function (e) {
                      return a(e);
                    }),
                  n.data.linkedNodes &&
                    Object.values(n.data.linkedNodes).map(function (e) {
                      return a(e);
                    }),
                  r.data.nodes.includes(t))
                ) {
                  var o = r.data.nodes;
                  o.splice(o.indexOf(t), 1);
                } else {
                  var i = Object.keys(r.data.linkedNodes).find(function (e) {
                    return r.data.linkedNodes[e] === e;
                  });
                  i && delete r.data.linkedNodes[i];
                }
                !(function (e, t) {
                  Object.keys(e.events).forEach(function (n) {
                    var r = e.events[n];
                    r &&
                      r.has &&
                      r.has(t) &&
                      (e.events[n] = new Set(
                        Array.from(r).filter(function (e) {
                          return t !== e;
                        })
                      ));
                  });
                })(e, t),
                  delete e.nodes[t];
              };
            return {
              addLinkedNodeFromTree: function (e, t, o) {
                var i = r(t).data.linkedNodes[o];
                i && a(i), n(e, t, { type: 'linked', id: o });
              },
              add: function (e, t, r) {
                var a = [e];
                Array.isArray(e) &&
                  (o('actions.add(node: Node[])', {
                    suggest: 'actions.add(node: Node)',
                  }),
                  (a = e)),
                  a.forEach(function (e) {
                    var o;
                    n(
                      { nodes: ((o = {}), (o[e.id] = e), o), rootNodeId: e.id },
                      t,
                      { type: 'child', index: r }
                    );
                  });
              },
              addNodeTree: function (e, t, r) {
                n(e, t, { type: 'child', index: r });
              },
              delete: function (n) {
                be(e.nodes, n, { existOnly: !0, idOnly: !0 }).forEach(function (
                  e
                ) {
                  var n = e.node;
                  W(!t.node(n.id).isTopLevelNode(), u), a(n.id);
                });
              },
              deserialize: function (e) {
                var n = 'string' == typeof e ? JSON.parse(e) : e,
                  r = Object.keys(n).map(function (e) {
                    var r = e;
                    return (
                      e === l && (r = d),
                      [
                        r,
                        t.parseSerializedNode(n[e]).toNode(function (e) {
                          return (e.id = r);
                        }),
                      ]
                    );
                  });
                this.replaceNodes(Oe(r));
              },
              move: function (n, r, o) {
                var a = be(e.nodes, n, { existOnly: !0 }),
                  i = e.nodes[r];
                a.forEach(function (n, a) {
                  var d = n.node,
                    s = d.id,
                    u = d.data.parent;
                  t.node(r).isDroppable([s], function (e) {
                    throw new Error(e);
                  });
                  var c = e.nodes[u].data.nodes;
                  (c[c.indexOf(s)] = 'marked'),
                    i.data.nodes.splice(o + a, 0, s),
                    (e.nodes[s].data.parent = r),
                    c.splice(c.indexOf('marked'), 1);
                });
              },
              replaceNodes: function (t) {
                this.clearEvents(), (e.nodes = t);
              },
              clearEvents: function () {
                this.setNodeEvent('selected', null),
                  this.setNodeEvent('hovered', null),
                  this.setNodeEvent('dragged', null),
                  this.setIndicator(null);
              },
              reset: function () {
                this.clearEvents(), this.replaceNodes({});
              },
              setOptions: function (t) {
                t(e.options);
              },
              setNodeEvent: function (t, n) {
                if (
                  (e.events[t].forEach(function (n) {
                    e.nodes[n] && (e.nodes[n].events[t] = !1);
                  }),
                  (e.events[t] = new Set()),
                  n)
                ) {
                  var r = be(e.nodes, n, { idOnly: !0, existOnly: !0 }),
                    o = new Set(
                      r.map(function (e) {
                        return e.node.id;
                      })
                    );
                  o.forEach(function (n) {
                    e.nodes[n].events[t] = !0;
                  }),
                    (e.events[t] = o);
                }
              },
              setCustom: function (t, n) {
                be(e.nodes, t, { idOnly: !0, existOnly: !0 }).forEach(function (
                  t
                ) {
                  return n(e.nodes[t.node.id].data.custom);
                });
              },
              setDOM: function (t, n) {
                e.nodes[t] && (e.nodes[t].dom = n);
              },
              setIndicator: function (t) {
                (t &&
                  (!t.placement.parent.dom ||
                    (t.placement.currentNode &&
                      !t.placement.currentNode.dom))) ||
                  (e.indicator = t);
              },
              setHidden: function (t, n) {
                e.nodes[t].data.hidden = n;
              },
              setProp: function (t, n) {
                be(e.nodes, t, { idOnly: !0, existOnly: !0 }).forEach(function (
                  t
                ) {
                  return n(e.nodes[t.node.id].data.props);
                });
              },
              selectNode: function (t) {
                if (t) {
                  var n = be(e.nodes, t, { idOnly: !0, existOnly: !0 });
                  this.setNodeEvent(
                    'selected',
                    n.map(function (e) {
                      return e.node.id;
                    })
                  );
                } else this.setNodeEvent('selected', null);
                this.setNodeEvent('hovered', null);
              },
            };
          })(e, t)
        ),
        {
          setState: function (t) {
            var n = V(this, ['history']);
            t(e, n);
          },
        }
      );
    },
    ignoreHistoryForActions: [
      'setDOM',
      'setNodeEvent',
      'selectNode',
      'clearEvents',
      'setOptions',
      'setIndicator',
    ],
    normalizeHistory: function (e) {
      Object.keys(e.events).forEach(function (t) {
        Array.from(e.events[t] || []).forEach(function (n) {
          e.nodes[n] || e.events[t].delete(n);
        });
      }),
        Object.keys(e.nodes).forEach(function (t) {
          var n = e.nodes[t];
          Object.keys(n.events).forEach(function (t) {
            n.events[t] &&
              e.events[t] &&
              !e.events[t].has(n.id) &&
              (n.events[t] = !1);
          });
        });
    },
  },
  Ye = function (e, t) {
    return j(Xe, U(U({}, Je), { options: U(U({}, Je.options), e) }), Re, t);
  },
  Ge = function (e) {
    var t = e.children,
      n = e.onRender,
      r = e.onNodesChange,
      o = e.resolver,
      a = e.enabled,
      i = e.indicator;
    void 0 !== o && W('object' == typeof o && !Array.isArray(o), q);
    var d = _(
        function () {
          return X(
            {
              onRender: n,
              onNodesChange: r,
              resolver: o,
              enabled: a,
              indicator: i,
            },
            function (e) {
              return void 0 !== e;
            }
          );
        },
        [a, i, r, n, o]
      ),
      s = Ye(d, function (e, t, n, r, o) {
        if (n)
          for (
            var a = n.patches, i = V(n, ['patches']), d = 0;
            d < a.length;
            d++
          ) {
            var s = a[d].path,
              u = s.length > 2 && 'nodes' === s[0] && 'data' === s[2];
            if (
              ([P.IGNORE, P.THROTTLE].includes(i.type) &&
                i.params &&
                (i.type = i.params[0]),
              ['setState', 'deserialize'].includes(i.type) || u)
            ) {
              o(function (n) {
                e.options.normalizeNodes &&
                  e.options.normalizeNodes(n, t, i, r);
              });
              break;
            }
          }
      });
    return (
      F(
        function () {
          s &&
            d &&
            s.actions.setOptions(function (e) {
              Object.assign(e, d);
            });
        },
        [s, d]
      ),
      F(
        function () {
          s.subscribe(
            function (e) {
              return { json: s.query.serialize() };
            },
            function () {
              s.query.getOptions().onNodesChange(s.query);
            }
          );
        },
        [s]
      ),
      s
        ? L.createElement(
            ee.Provider,
            { value: s },
            L.createElement(We, null, t)
          )
        : null
    );
  },
  Ke = function (e) {
    var t = e.events,
      n = e.data,
      r = n.nodes,
      o = n.linkedNodes,
      a = V(e, ['events', 'data']),
      i = Se(Y(e));
    return {
      node: (e = U(U(U({}, i), a), {
        events: U(U({}, i.events), t),
        dom: e.dom || i.dom,
      })),
      childNodes: r,
      linkedNodes: o,
    };
  },
  Ue = function (e, t) {
    var n = t.nodes,
      r = V(t, ['nodes']),
      o = e.nodes,
      a = V(e, ['nodes']);
    expect(a).toEqual(r);
    var i = Object.keys(n).reduce(function (e, t) {
        var r = V(n[t], ['_hydrationTimestamp', 'rules']);
        return (e[t] = r), e;
      }, {}),
      d = Object.keys(o).reduce(function (e, t) {
        var n = V(o[t], ['_hydrationTimestamp', 'rules']);
        return (e[t] = n), e;
      }, {});
    expect(d).toEqual(i);
  },
  Ve = function (e) {
    var t = {},
      n = function (e) {
        var r = Ke(e),
          o = r.node,
          a = r.childNodes,
          i = r.linkedNodes;
        (t[o.id] = o),
          a &&
            a.forEach(function (e, r) {
              var a = Ke(e),
                i = a.node,
                d = a.childNodes,
                s = a.linkedNodes;
              (i.data.parent = o.id),
                (t[i.id] = i),
                (o.data.nodes[r] = i.id),
                n(
                  U(U({}, i), {
                    data: U(U({}, i.data), {
                      nodes: d || [],
                      linkedNodes: s || {},
                    }),
                  })
                );
            }),
          i &&
            Object.keys(i).forEach(function (e) {
              var r = Ke(i[e]),
                a = r.node,
                d = r.childNodes,
                s = r.linkedNodes;
              (o.data.linkedNodes[e] = a.id),
                (a.data.parent = o.id),
                (t[a.id] = a),
                n(
                  U(U({}, a), {
                    data: U(U({}, a.data), {
                      nodes: d || [],
                      linkedNodes: s || {},
                    }),
                  })
                );
            });
      };
    return n(e), t;
  },
  Qe = function (e) {
    void 0 === e && (e = {});
    var t = e.nodes,
      n = e.events;
    return U(U(U({}, Je), e), {
      nodes: t ? Ve(t) : {},
      events: U(U({}, Je.events), n || {}),
    });
  };
export {
  Xe as ActionMethodsWithConfig,
  Canvas,
  Ae as CoreEventHandlers,
  Me as DefaultEventHandlers,
  _e as DerivedCoreEventHandlers,
  Ge as Editor,
  fe as Element,
  We as Events,
  ge as Frame,
  ue as NodeElement,
  xe as NodeHelpers,
  $ as NodeProvider,
  ve as NodeSelectorType,
  Re as QueryMethods,
  Ne as connectEditor,
  Ee as connectNode,
  Ve as createTestNodes,
  Qe as createTestState,
  ce as defaultElementProps,
  pe as deprecateCanvasComponent,
  Je as editorInitialState,
  le as elementPropToNodeData,
  Ue as expectEditorState,
  me as useEditor,
  Ye as useEditorStore,
  ne as useEventHandler,
  ae as useNode,
};
