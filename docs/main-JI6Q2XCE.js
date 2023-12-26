var Bp = Object.defineProperty,
	Hp = Object.defineProperties;
var zp = Object.getOwnPropertyDescriptors;
var jr = Object.getOwnPropertySymbols;
var dc = Object.prototype.hasOwnProperty,
	fc = Object.prototype.propertyIsEnumerable;
var lc = (t, e, r) =>
		e in t
			? Bp(t, e, {
					enumerable: !0,
					configurable: !0,
					writable: !0,
					value: r,
				})
			: (t[e] = r),
	m = (t, e) => {
		for (var r in (e ||= {})) dc.call(e, r) && lc(t, r, e[r]);
		if (jr) for (var r of jr(e)) fc.call(e, r) && lc(t, r, e[r]);
		return t;
	},
	j = (t, e) => Hp(t, zp(e));
var hc = (t, e) => {
	var r = {};
	for (var n in t) dc.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
	if (t != null && jr)
		for (var n of jr(t)) e.indexOf(n) < 0 && fc.call(t, n) && (r[n] = t[n]);
	return r;
};
var pc = null;
var zo = 1;
function oe(t) {
	let e = pc;
	return (pc = t), e;
}
var gc = {
	version: 0,
	lastCleanEpoch: 0,
	dirty: !1,
	producerNode: void 0,
	producerLastReadVersion: void 0,
	producerIndexOfThis: void 0,
	nextProducerIndex: 0,
	liveConsumerNode: void 0,
	liveConsumerIndexOfThis: void 0,
	consumerAllowSignalWrites: !1,
	consumerIsAlwaysLive: !1,
	producerMustRecompute: () => !1,
	producerRecomputeValue: () => {},
	consumerMarkedDirty: () => {},
	consumerOnSignalRead: () => {},
};
function Gp(t) {
	if (!(qo(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === zo)) {
		if (!t.producerMustRecompute(t) && !Go(t)) {
			(t.dirty = !1), (t.lastCleanEpoch = zo);
			return;
		}
		t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = zo);
	}
}
function mc(t) {
	return t && (t.nextProducerIndex = 0), oe(t);
}
function vc(t, e) {
	if (
		(oe(e),
		!(
			!t ||
			t.producerNode === void 0 ||
			t.producerIndexOfThis === void 0 ||
			t.producerLastReadVersion === void 0
		))
	) {
		if (qo(t))
			for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
				Wo(t.producerNode[r], t.producerIndexOfThis[r]);
		for (; t.producerNode.length > t.nextProducerIndex; )
			t.producerNode.pop(),
				t.producerLastReadVersion.pop(),
				t.producerIndexOfThis.pop();
	}
}
function Go(t) {
	$r(t);
	for (let e = 0; e < t.producerNode.length; e++) {
		let r = t.producerNode[e],
			n = t.producerLastReadVersion[e];
		if (n !== r.version || (Gp(r), n !== r.version)) return !0;
	}
	return !1;
}
function yc(t) {
	if (($r(t), qo(t)))
		for (let e = 0; e < t.producerNode.length; e++)
			Wo(t.producerNode[e], t.producerIndexOfThis[e]);
	(t.producerNode.length =
		t.producerLastReadVersion.length =
		t.producerIndexOfThis.length =
			0),
		t.liveConsumerNode &&
			(t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function Wo(t, e) {
	if ((Wp(t), $r(t), t.liveConsumerNode.length === 1))
		for (let n = 0; n < t.producerNode.length; n++)
			Wo(t.producerNode[n], t.producerIndexOfThis[n]);
	let r = t.liveConsumerNode.length - 1;
	if (
		((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
		(t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
		t.liveConsumerNode.length--,
		t.liveConsumerIndexOfThis.length--,
		e < t.liveConsumerNode.length)
	) {
		let n = t.liveConsumerIndexOfThis[e],
			i = t.liveConsumerNode[e];
		$r(i), (i.producerIndexOfThis[n] = e);
	}
}
function qo(t) {
	return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function $r(t) {
	(t.producerNode ??= []),
		(t.producerIndexOfThis ??= []),
		(t.producerLastReadVersion ??= []);
}
function Wp(t) {
	(t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function qp() {
	throw new Error();
}
var Zp = qp;
function Dc(t) {
	Zp = t;
}
function _(t) {
	return typeof t == "function";
}
function $t(t) {
	let r = t((n) => {
		Error.call(n), (n.stack = new Error().stack);
	});
	return (
		(r.prototype = Object.create(Error.prototype)),
		(r.prototype.constructor = r),
		r
	);
}
var Ur = $t(
	(t) =>
		function (r) {
			t(this),
				(this.message = r
					? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
					: ""),
				(this.name = "UnsubscriptionError"),
				(this.errors = r);
		},
);
function Ln(t, e) {
	if (t) {
		let r = t.indexOf(e);
		0 <= r && t.splice(r, 1);
	}
}
var q = class t {
	constructor(e) {
		(this.initialTeardown = e),
			(this.closed = !1),
			(this._parentage = null),
			(this._finalizers = null);
	}
	unsubscribe() {
		let e;
		if (!this.closed) {
			this.closed = !0;
			let { _parentage: r } = this;
			if (r)
				if (((this._parentage = null), Array.isArray(r)))
					for (let o of r) o.remove(this);
				else r.remove(this);
			let { initialTeardown: n } = this;
			if (_(n))
				try {
					n();
				} catch (o) {
					e = o instanceof Ur ? o.errors : [o];
				}
			let { _finalizers: i } = this;
			if (i) {
				this._finalizers = null;
				for (let o of i)
					try {
						Cc(o);
					} catch (s) {
						(e = e ?? []),
							s instanceof Ur
								? (e = [...e, ...s.errors])
								: e.push(s);
					}
			}
			if (e) throw new Ur(e);
		}
	}
	add(e) {
		var r;
		if (e && e !== this)
			if (this.closed) Cc(e);
			else {
				if (e instanceof t) {
					if (e.closed || e._hasParent(this)) return;
					e._addParent(this);
				}
				(this._finalizers =
					(r = this._finalizers) !== null && r !== void 0
						? r
						: []).push(e);
			}
	}
	_hasParent(e) {
		let { _parentage: r } = this;
		return r === e || (Array.isArray(r) && r.includes(e));
	}
	_addParent(e) {
		let { _parentage: r } = this;
		this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
	}
	_removeParent(e) {
		let { _parentage: r } = this;
		r === e ? (this._parentage = null) : Array.isArray(r) && Ln(r, e);
	}
	remove(e) {
		let { _finalizers: r } = this;
		r && Ln(r, e), e instanceof t && e._removeParent(this);
	}
};
q.EMPTY = (() => {
	let t = new q();
	return (t.closed = !0), t;
})();
var Zo = q.EMPTY;
function Br(t) {
	return (
		t instanceof q ||
		(t && "closed" in t && _(t.remove) && _(t.add) && _(t.unsubscribe))
	);
}
function Cc(t) {
	_(t) ? t() : t.unsubscribe();
}
var Me = {
	onUnhandledError: null,
	onStoppedNotification: null,
	Promise: void 0,
	useDeprecatedSynchronousErrorHandling: !1,
	useDeprecatedNextContext: !1,
};
var Ut = {
	setTimeout(t, e, ...r) {
		let { delegate: n } = Ut;
		return n?.setTimeout
			? n.setTimeout(t, e, ...r)
			: setTimeout(t, e, ...r);
	},
	clearTimeout(t) {
		let { delegate: e } = Ut;
		return (e?.clearTimeout || clearTimeout)(t);
	},
	delegate: void 0,
};
function Hr(t) {
	Ut.setTimeout(() => {
		let { onUnhandledError: e } = Me;
		if (e) e(t);
		else throw t;
	});
}
function Vn() {}
var wc = (() => Yo("C", void 0, void 0))();
function Ec(t) {
	return Yo("E", void 0, t);
}
function Ic(t) {
	return Yo("N", t, void 0);
}
function Yo(t, e, r) {
	return { kind: t, value: e, error: r };
}
var yt = null;
function Bt(t) {
	if (Me.useDeprecatedSynchronousErrorHandling) {
		let e = !yt;
		if ((e && (yt = { errorThrown: !1, error: null }), t(), e)) {
			let { errorThrown: r, error: n } = yt;
			if (((yt = null), r)) throw n;
		}
	} else t();
}
function bc(t) {
	Me.useDeprecatedSynchronousErrorHandling &&
		yt &&
		((yt.errorThrown = !0), (yt.error = t));
}
var Dt = class extends q {
		constructor(e) {
			super(),
				(this.isStopped = !1),
				e
					? ((this.destination = e), Br(e) && e.add(this))
					: (this.destination = Kp);
		}
		static create(e, r, n) {
			return new Ht(e, r, n);
		}
		next(e) {
			this.isStopped ? Ko(Ic(e), this) : this._next(e);
		}
		error(e) {
			this.isStopped
				? Ko(Ec(e), this)
				: ((this.isStopped = !0), this._error(e));
		}
		complete() {
			this.isStopped
				? Ko(wc, this)
				: ((this.isStopped = !0), this._complete());
		}
		unsubscribe() {
			this.closed ||
				((this.isStopped = !0),
				super.unsubscribe(),
				(this.destination = null));
		}
		_next(e) {
			this.destination.next(e);
		}
		_error(e) {
			try {
				this.destination.error(e);
			} finally {
				this.unsubscribe();
			}
		}
		_complete() {
			try {
				this.destination.complete();
			} finally {
				this.unsubscribe();
			}
		}
	},
	Yp = Function.prototype.bind;
function Qo(t, e) {
	return Yp.call(t, e);
}
var Jo = class {
		constructor(e) {
			this.partialObserver = e;
		}
		next(e) {
			let { partialObserver: r } = this;
			if (r.next)
				try {
					r.next(e);
				} catch (n) {
					zr(n);
				}
		}
		error(e) {
			let { partialObserver: r } = this;
			if (r.error)
				try {
					r.error(e);
				} catch (n) {
					zr(n);
				}
			else zr(e);
		}
		complete() {
			let { partialObserver: e } = this;
			if (e.complete)
				try {
					e.complete();
				} catch (r) {
					zr(r);
				}
		}
	},
	Ht = class extends Dt {
		constructor(e, r, n) {
			super();
			let i;
			if (_(e) || !e)
				i = {
					next: e ?? void 0,
					error: r ?? void 0,
					complete: n ?? void 0,
				};
			else {
				let o;
				this && Me.useDeprecatedNextContext
					? ((o = Object.create(e)),
						(o.unsubscribe = () => this.unsubscribe()),
						(i = {
							next: e.next && Qo(e.next, o),
							error: e.error && Qo(e.error, o),
							complete: e.complete && Qo(e.complete, o),
						}))
					: (i = e);
			}
			this.destination = new Jo(i);
		}
	};
function zr(t) {
	Me.useDeprecatedSynchronousErrorHandling ? bc(t) : Hr(t);
}
function Qp(t) {
	throw t;
}
function Ko(t, e) {
	let { onStoppedNotification: r } = Me;
	r && Ut.setTimeout(() => r(t, e));
}
var Kp = { closed: !0, next: Vn, error: Qp, complete: Vn };
var zt = (() =>
	(typeof Symbol == "function" && Symbol.observable) || "@@observable")();
function se(t) {
	return t;
}
function Xo(...t) {
	return es(t);
}
function es(t) {
	return t.length === 0
		? se
		: t.length === 1
			? t[0]
			: function (r) {
					return t.reduce((n, i) => i(n), r);
				};
}
var F = (() => {
	class t {
		constructor(r) {
			r && (this._subscribe = r);
		}
		lift(r) {
			let n = new t();
			return (n.source = this), (n.operator = r), n;
		}
		subscribe(r, n, i) {
			let o = Xp(r) ? r : new Ht(r, n, i);
			return (
				Bt(() => {
					let { operator: s, source: a } = this;
					o.add(
						s
							? s.call(o, a)
							: a
								? this._subscribe(o)
								: this._trySubscribe(o),
					);
				}),
				o
			);
		}
		_trySubscribe(r) {
			try {
				return this._subscribe(r);
			} catch (n) {
				r.error(n);
			}
		}
		forEach(r, n) {
			return (
				(n = Mc(n)),
				new n((i, o) => {
					let s = new Ht({
						next: (a) => {
							try {
								r(a);
							} catch (u) {
								o(u), s.unsubscribe();
							}
						},
						error: o,
						complete: i,
					});
					this.subscribe(s);
				})
			);
		}
		_subscribe(r) {
			var n;
			return (n = this.source) === null || n === void 0
				? void 0
				: n.subscribe(r);
		}
		[zt]() {
			return this;
		}
		pipe(...r) {
			return es(r)(this);
		}
		toPromise(r) {
			return (
				(r = Mc(r)),
				new r((n, i) => {
					let o;
					this.subscribe(
						(s) => (o = s),
						(s) => i(s),
						() => n(o),
					);
				})
			);
		}
	}
	return (t.create = (e) => new t(e)), t;
})();
function Mc(t) {
	var e;
	return (e = t ?? Me.Promise) !== null && e !== void 0 ? e : Promise;
}
function Jp(t) {
	return t && _(t.next) && _(t.error) && _(t.complete);
}
function Xp(t) {
	return (t && t instanceof Dt) || (Jp(t) && Br(t));
}
function ts(t) {
	return _(t?.lift);
}
function R(t) {
	return (e) => {
		if (ts(e))
			return e.lift(function (r) {
				try {
					return t(r, this);
				} catch (n) {
					this.error(n);
				}
			});
		throw new TypeError("Unable to lift unknown Observable type");
	};
}
function N(t, e, r, n, i) {
	return new ns(t, e, r, n, i);
}
var ns = class extends Dt {
	constructor(e, r, n, i, o, s) {
		super(e),
			(this.onFinalize = o),
			(this.shouldUnsubscribe = s),
			(this._next = r
				? function (a) {
						try {
							r(a);
						} catch (u) {
							e.error(u);
						}
					}
				: super._next),
			(this._error = i
				? function (a) {
						try {
							i(a);
						} catch (u) {
							e.error(u);
						} finally {
							this.unsubscribe();
						}
					}
				: super._error),
			(this._complete = n
				? function () {
						try {
							n();
						} catch (a) {
							e.error(a);
						} finally {
							this.unsubscribe();
						}
					}
				: super._complete);
	}
	unsubscribe() {
		var e;
		if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
			let { closed: r } = this;
			super.unsubscribe(),
				!r &&
					((e = this.onFinalize) === null ||
						e === void 0 ||
						e.call(this));
		}
	}
};
function Gt() {
	return R((t, e) => {
		let r = null;
		t._refCount++;
		let n = N(e, void 0, void 0, void 0, () => {
			if (!t || t._refCount <= 0 || 0 < --t._refCount) {
				r = null;
				return;
			}
			let i = t._connection,
				o = r;
			(r = null),
				i && (!o || i === o) && i.unsubscribe(),
				e.unsubscribe();
		});
		t.subscribe(n), n.closed || (r = t.connect());
	});
}
var Wt = class extends F {
	constructor(e, r) {
		super(),
			(this.source = e),
			(this.subjectFactory = r),
			(this._subject = null),
			(this._refCount = 0),
			(this._connection = null),
			ts(e) && (this.lift = e.lift);
	}
	_subscribe(e) {
		return this.getSubject().subscribe(e);
	}
	getSubject() {
		let e = this._subject;
		return (
			(!e || e.isStopped) && (this._subject = this.subjectFactory()),
			this._subject
		);
	}
	_teardown() {
		this._refCount = 0;
		let { _connection: e } = this;
		(this._subject = this._connection = null), e?.unsubscribe();
	}
	connect() {
		let e = this._connection;
		if (!e) {
			e = this._connection = new q();
			let r = this.getSubject();
			e.add(
				this.source.subscribe(
					N(
						r,
						void 0,
						() => {
							this._teardown(), r.complete();
						},
						(n) => {
							this._teardown(), r.error(n);
						},
						() => this._teardown(),
					),
				),
			),
				e.closed && ((this._connection = null), (e = q.EMPTY));
		}
		return e;
	}
	refCount() {
		return Gt()(this);
	}
};
var _c = $t(
	(t) =>
		function () {
			t(this),
				(this.name = "ObjectUnsubscribedError"),
				(this.message = "object unsubscribed");
		},
);
var ae = (() => {
		class t extends F {
			constructor() {
				super(),
					(this.closed = !1),
					(this.currentObservers = null),
					(this.observers = []),
					(this.isStopped = !1),
					(this.hasError = !1),
					(this.thrownError = null);
			}
			lift(r) {
				let n = new Gr(this, this);
				return (n.operator = r), n;
			}
			_throwIfClosed() {
				if (this.closed) throw new _c();
			}
			next(r) {
				Bt(() => {
					if ((this._throwIfClosed(), !this.isStopped)) {
						this.currentObservers ||
							(this.currentObservers = Array.from(
								this.observers,
							));
						for (let n of this.currentObservers) n.next(r);
					}
				});
			}
			error(r) {
				Bt(() => {
					if ((this._throwIfClosed(), !this.isStopped)) {
						(this.hasError = this.isStopped = !0),
							(this.thrownError = r);
						let { observers: n } = this;
						for (; n.length; ) n.shift().error(r);
					}
				});
			}
			complete() {
				Bt(() => {
					if ((this._throwIfClosed(), !this.isStopped)) {
						this.isStopped = !0;
						let { observers: r } = this;
						for (; r.length; ) r.shift().complete();
					}
				});
			}
			unsubscribe() {
				(this.isStopped = this.closed = !0),
					(this.observers = this.currentObservers = null);
			}
			get observed() {
				var r;
				return (
					((r = this.observers) === null || r === void 0
						? void 0
						: r.length) > 0
				);
			}
			_trySubscribe(r) {
				return this._throwIfClosed(), super._trySubscribe(r);
			}
			_subscribe(r) {
				return (
					this._throwIfClosed(),
					this._checkFinalizedStatuses(r),
					this._innerSubscribe(r)
				);
			}
			_innerSubscribe(r) {
				let { hasError: n, isStopped: i, observers: o } = this;
				return n || i
					? Zo
					: ((this.currentObservers = null),
						o.push(r),
						new q(() => {
							(this.currentObservers = null), Ln(o, r);
						}));
			}
			_checkFinalizedStatuses(r) {
				let { hasError: n, thrownError: i, isStopped: o } = this;
				n ? r.error(i) : o && r.complete();
			}
			asObservable() {
				let r = new F();
				return (r.source = this), r;
			}
		}
		return (t.create = (e, r) => new Gr(e, r)), t;
	})(),
	Gr = class extends ae {
		constructor(e, r) {
			super(), (this.destination = e), (this.source = r);
		}
		next(e) {
			var r, n;
			(n =
				(r = this.destination) === null || r === void 0
					? void 0
					: r.next) === null ||
				n === void 0 ||
				n.call(r, e);
		}
		error(e) {
			var r, n;
			(n =
				(r = this.destination) === null || r === void 0
					? void 0
					: r.error) === null ||
				n === void 0 ||
				n.call(r, e);
		}
		complete() {
			var e, r;
			(r =
				(e = this.destination) === null || e === void 0
					? void 0
					: e.complete) === null ||
				r === void 0 ||
				r.call(e);
		}
		_subscribe(e) {
			var r, n;
			return (n =
				(r = this.source) === null || r === void 0
					? void 0
					: r.subscribe(e)) !== null && n !== void 0
				? n
				: Zo;
		}
	};
var Q = class extends ae {
	constructor(e) {
		super(), (this._value = e);
	}
	get value() {
		return this.getValue();
	}
	_subscribe(e) {
		let r = super._subscribe(e);
		return !r.closed && e.next(this._value), r;
	}
	getValue() {
		let { hasError: e, thrownError: r, _value: n } = this;
		if (e) throw r;
		return this._throwIfClosed(), n;
	}
	next(e) {
		super.next((this._value = e));
	}
};
var ve = new F((t) => t.complete());
function Sc(t) {
	return t && _(t.schedule);
}
function Tc(t) {
	return t[t.length - 1];
}
function Wr(t) {
	return _(Tc(t)) ? t.pop() : void 0;
}
function Xe(t) {
	return Sc(Tc(t)) ? t.pop() : void 0;
}
function Ac(t, e, r, n) {
	function i(o) {
		return o instanceof r
			? o
			: new r(function (s) {
					s(o);
				});
	}
	return new (r || (r = Promise))(function (o, s) {
		function a(l) {
			try {
				c(n.next(l));
			} catch (d) {
				s(d);
			}
		}
		function u(l) {
			try {
				c(n.throw(l));
			} catch (d) {
				s(d);
			}
		}
		function c(l) {
			l.done ? o(l.value) : i(l.value).then(a, u);
		}
		c((n = n.apply(t, e || [])).next());
	});
}
function xc(t) {
	var e = typeof Symbol == "function" && Symbol.iterator,
		r = e && t[e],
		n = 0;
	if (r) return r.call(t);
	if (t && typeof t.length == "number")
		return {
			next: function () {
				return (
					t && n >= t.length && (t = void 0),
					{ value: t && t[n++], done: !t }
				);
			},
		};
	throw new TypeError(
		e ? "Object is not iterable." : "Symbol.iterator is not defined.",
	);
}
function Ct(t) {
	return this instanceof Ct ? ((this.v = t), this) : new Ct(t);
}
function Nc(t, e, r) {
	if (!Symbol.asyncIterator)
		throw new TypeError("Symbol.asyncIterator is not defined.");
	var n = r.apply(t, e || []),
		i,
		o = [];
	return (
		(i = {}),
		s("next"),
		s("throw"),
		s("return"),
		(i[Symbol.asyncIterator] = function () {
			return this;
		}),
		i
	);
	function s(f) {
		n[f] &&
			(i[f] = function (h) {
				return new Promise(function (g, T) {
					o.push([f, h, g, T]) > 1 || a(f, h);
				});
			});
	}
	function a(f, h) {
		try {
			u(n[f](h));
		} catch (g) {
			d(o[0][3], g);
		}
	}
	function u(f) {
		f.value instanceof Ct
			? Promise.resolve(f.value.v).then(c, l)
			: d(o[0][2], f);
	}
	function c(f) {
		a("next", f);
	}
	function l(f) {
		a("throw", f);
	}
	function d(f, h) {
		f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
	}
}
function Oc(t) {
	if (!Symbol.asyncIterator)
		throw new TypeError("Symbol.asyncIterator is not defined.");
	var e = t[Symbol.asyncIterator],
		r;
	return e
		? e.call(t)
		: ((t = typeof xc == "function" ? xc(t) : t[Symbol.iterator]()),
			(r = {}),
			n("next"),
			n("throw"),
			n("return"),
			(r[Symbol.asyncIterator] = function () {
				return this;
			}),
			r);
	function n(o) {
		r[o] =
			t[o] &&
			function (s) {
				return new Promise(function (a, u) {
					(s = t[o](s)), i(a, u, s.done, s.value);
				});
			};
	}
	function i(o, s, a, u) {
		Promise.resolve(u).then(function (c) {
			o({ value: c, done: a });
		}, s);
	}
}
var qr = (t) => t && typeof t.length == "number" && typeof t != "function";
function Zr(t) {
	return _(t?.then);
}
function Yr(t) {
	return _(t[zt]);
}
function Qr(t) {
	return Symbol.asyncIterator && _(t?.[Symbol.asyncIterator]);
}
function Kr(t) {
	return new TypeError(
		`You provided ${
			t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
		} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
	);
}
function eg() {
	return typeof Symbol != "function" || !Symbol.iterator
		? "@@iterator"
		: Symbol.iterator;
}
var Jr = eg();
function Xr(t) {
	return _(t?.[Jr]);
}
function ei(t) {
	return Nc(this, arguments, function* () {
		let r = t.getReader();
		try {
			for (;;) {
				let { value: n, done: i } = yield Ct(r.read());
				if (i) return yield Ct(void 0);
				yield yield Ct(n);
			}
		} finally {
			r.releaseLock();
		}
	});
}
function ti(t) {
	return _(t?.getReader);
}
function z(t) {
	if (t instanceof F) return t;
	if (t != null) {
		if (Yr(t)) return tg(t);
		if (qr(t)) return ng(t);
		if (Zr(t)) return rg(t);
		if (Qr(t)) return Rc(t);
		if (Xr(t)) return ig(t);
		if (ti(t)) return og(t);
	}
	throw Kr(t);
}
function tg(t) {
	return new F((e) => {
		let r = t[zt]();
		if (_(r.subscribe)) return r.subscribe(e);
		throw new TypeError(
			"Provided object does not correctly implement Symbol.observable",
		);
	});
}
function ng(t) {
	return new F((e) => {
		for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
		e.complete();
	});
}
function rg(t) {
	return new F((e) => {
		t.then(
			(r) => {
				e.closed || (e.next(r), e.complete());
			},
			(r) => e.error(r),
		).then(null, Hr);
	});
}
function ig(t) {
	return new F((e) => {
		for (let r of t) if ((e.next(r), e.closed)) return;
		e.complete();
	});
}
function Rc(t) {
	return new F((e) => {
		sg(t, e).catch((r) => e.error(r));
	});
}
function og(t) {
	return Rc(ei(t));
}
function sg(t, e) {
	var r, n, i, o;
	return Ac(this, void 0, void 0, function* () {
		try {
			for (r = Oc(t); (n = yield r.next()), !n.done; ) {
				let s = n.value;
				if ((e.next(s), e.closed)) return;
			}
		} catch (s) {
			i = { error: s };
		} finally {
			try {
				n && !n.done && (o = r.return) && (yield o.call(r));
			} finally {
				if (i) throw i.error;
			}
		}
		e.complete();
	});
}
function ne(t, e, r, n = 0, i = !1) {
	let o = e.schedule(function () {
		r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
	}, n);
	if ((t.add(o), !i)) return o;
}
function ni(t, e = 0) {
	return R((r, n) => {
		r.subscribe(
			N(
				n,
				(i) => ne(n, t, () => n.next(i), e),
				() => ne(n, t, () => n.complete(), e),
				(i) => ne(n, t, () => n.error(i), e),
			),
		);
	});
}
function ri(t, e = 0) {
	return R((r, n) => {
		n.add(t.schedule(() => r.subscribe(n), e));
	});
}
function Fc(t, e) {
	return z(t).pipe(ri(e), ni(e));
}
function Pc(t, e) {
	return z(t).pipe(ri(e), ni(e));
}
function kc(t, e) {
	return new F((r) => {
		let n = 0;
		return e.schedule(function () {
			n === t.length
				? r.complete()
				: (r.next(t[n++]), r.closed || this.schedule());
		});
	});
}
function Lc(t, e) {
	return new F((r) => {
		let n;
		return (
			ne(r, e, () => {
				(n = t[Jr]()),
					ne(
						r,
						e,
						() => {
							let i, o;
							try {
								({ value: i, done: o } = n.next());
							} catch (s) {
								r.error(s);
								return;
							}
							o ? r.complete() : r.next(i);
						},
						0,
						!0,
					);
			}),
			() => _(n?.return) && n.return()
		);
	});
}
function ii(t, e) {
	if (!t) throw new Error("Iterable cannot be null");
	return new F((r) => {
		ne(r, e, () => {
			let n = t[Symbol.asyncIterator]();
			ne(
				r,
				e,
				() => {
					n.next().then((i) => {
						i.done ? r.complete() : r.next(i.value);
					});
				},
				0,
				!0,
			);
		});
	});
}
function Vc(t, e) {
	return ii(ei(t), e);
}
function jc(t, e) {
	if (t != null) {
		if (Yr(t)) return Fc(t, e);
		if (qr(t)) return kc(t, e);
		if (Zr(t)) return Pc(t, e);
		if (Qr(t)) return ii(t, e);
		if (Xr(t)) return Lc(t, e);
		if (ti(t)) return Vc(t, e);
	}
	throw Kr(t);
}
function $(t, e) {
	return e ? jc(t, e) : z(t);
}
function M(...t) {
	let e = Xe(t);
	return $(t, e);
}
function qt(t, e) {
	let r = _(t) ? t : () => t,
		n = (i) => i.error(r());
	return new F(e ? (i) => e.schedule(n, 0, i) : n);
}
function rs(t) {
	return !!t && (t instanceof F || (_(t.lift) && _(t.subscribe)));
}
var Be = $t(
	(t) =>
		function () {
			t(this),
				(this.name = "EmptyError"),
				(this.message = "no elements in sequence");
		},
);
function E(t, e) {
	return R((r, n) => {
		let i = 0;
		r.subscribe(
			N(n, (o) => {
				n.next(t.call(e, o, i++));
			}),
		);
	});
}
var { isArray: ag } = Array;
function ug(t, e) {
	return ag(e) ? t(...e) : t(e);
}
function oi(t) {
	return E((e) => ug(t, e));
}
var { isArray: cg } = Array,
	{ getPrototypeOf: lg, prototype: dg, keys: fg } = Object;
function si(t) {
	if (t.length === 1) {
		let e = t[0];
		if (cg(e)) return { args: e, keys: null };
		if (hg(e)) {
			let r = fg(e);
			return { args: r.map((n) => e[n]), keys: r };
		}
	}
	return { args: t, keys: null };
}
function hg(t) {
	return t && typeof t == "object" && lg(t) === dg;
}
function ai(t, e) {
	return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function ui(...t) {
	let e = Xe(t),
		r = Wr(t),
		{ args: n, keys: i } = si(t);
	if (n.length === 0) return $([], e);
	let o = new F(pg(n, e, i ? (s) => ai(i, s) : se));
	return r ? o.pipe(oi(r)) : o;
}
function pg(t, e, r = se) {
	return (n) => {
		$c(
			e,
			() => {
				let { length: i } = t,
					o = new Array(i),
					s = i,
					a = i;
				for (let u = 0; u < i; u++)
					$c(
						e,
						() => {
							let c = $(t[u], e),
								l = !1;
							c.subscribe(
								N(
									n,
									(d) => {
										(o[u] = d),
											l || ((l = !0), a--),
											a || n.next(r(o.slice()));
									},
									() => {
										--s || n.complete();
									},
								),
							);
						},
						n,
					);
			},
			n,
		);
	};
}
function $c(t, e, r) {
	t ? ne(r, t, e) : e();
}
function Uc(t, e, r, n, i, o, s, a) {
	let u = [],
		c = 0,
		l = 0,
		d = !1,
		f = () => {
			d && !u.length && !c && e.complete();
		},
		h = (T) => (c < n ? g(T) : u.push(T)),
		g = (T) => {
			o && e.next(T), c++;
			let b = !1;
			z(r(T, l++)).subscribe(
				N(
					e,
					(y) => {
						i?.(y), o ? h(y) : e.next(y);
					},
					() => {
						b = !0;
					},
					void 0,
					() => {
						if (b)
							try {
								for (c--; u.length && c < n; ) {
									let y = u.shift();
									s ? ne(e, s, () => g(y)) : g(y);
								}
								f();
							} catch (y) {
								e.error(y);
							}
					},
				),
			);
		};
	return (
		t.subscribe(
			N(e, h, () => {
				(d = !0), f();
			}),
		),
		() => {
			a?.();
		}
	);
}
function Z(t, e, r = 1 / 0) {
	return _(e)
		? Z((n, i) => E((o, s) => e(n, o, i, s))(z(t(n, i))), r)
		: (typeof e == "number" && (r = e), R((n, i) => Uc(n, i, t, r)));
}
function is(t = 1 / 0) {
	return Z(se, t);
}
function Bc() {
	return is(1);
}
function Zt(...t) {
	return Bc()($(t, Xe(t)));
}
function ci(t) {
	return new F((e) => {
		z(t()).subscribe(e);
	});
}
function os(...t) {
	let e = Wr(t),
		{ args: r, keys: n } = si(t),
		i = new F((o) => {
			let { length: s } = r;
			if (!s) {
				o.complete();
				return;
			}
			let a = new Array(s),
				u = s,
				c = s;
			for (let l = 0; l < s; l++) {
				let d = !1;
				z(r[l]).subscribe(
					N(
						o,
						(f) => {
							d || ((d = !0), c--), (a[l] = f);
						},
						() => u--,
						void 0,
						() => {
							(!u || !d) &&
								(c || o.next(n ? ai(n, a) : a), o.complete());
						},
					),
				);
			}
		});
	return e ? i.pipe(oi(e)) : i;
}
function ue(t, e) {
	return R((r, n) => {
		let i = 0;
		r.subscribe(N(n, (o) => t.call(e, o, i++) && n.next(o)));
	});
}
function et(t) {
	return R((e, r) => {
		let n = null,
			i = !1,
			o;
		(n = e.subscribe(
			N(r, void 0, void 0, (s) => {
				(o = z(t(s, et(t)(e)))),
					n
						? (n.unsubscribe(), (n = null), o.subscribe(r))
						: (i = !0);
			}),
		)),
			i && (n.unsubscribe(), (n = null), o.subscribe(r));
	});
}
function Hc(t, e, r, n, i) {
	return (o, s) => {
		let a = r,
			u = e,
			c = 0;
		o.subscribe(
			N(
				s,
				(l) => {
					let d = c++;
					(u = a ? t(u, l, d) : ((a = !0), l)), n && s.next(u);
				},
				i &&
					(() => {
						a && s.next(u), s.complete();
					}),
			),
		);
	};
}
function tt(t, e) {
	return _(e) ? Z(t, e, 1) : Z(t, 1);
}
function nt(t) {
	return R((e, r) => {
		let n = !1;
		e.subscribe(
			N(
				r,
				(i) => {
					(n = !0), r.next(i);
				},
				() => {
					n || r.next(t), r.complete();
				},
			),
		);
	});
}
function He(t) {
	return t <= 0
		? () => ve
		: R((e, r) => {
				let n = 0;
				e.subscribe(
					N(r, (i) => {
						++n <= t && (r.next(i), t <= n && r.complete());
					}),
				);
			});
}
function ss(t) {
	return E(() => t);
}
function li(t = gg) {
	return R((e, r) => {
		let n = !1;
		e.subscribe(
			N(
				r,
				(i) => {
					(n = !0), r.next(i);
				},
				() => (n ? r.complete() : r.error(t())),
			),
		);
	});
}
function gg() {
	return new Be();
}
function wt(t) {
	return R((e, r) => {
		try {
			e.subscribe(r);
		} finally {
			r.add(t);
		}
	});
}
function _e(t, e) {
	let r = arguments.length >= 2;
	return (n) =>
		n.pipe(
			t ? ue((i, o) => t(i, o, n)) : se,
			He(1),
			r ? nt(e) : li(() => new Be()),
		);
}
function Yt(t) {
	return t <= 0
		? () => ve
		: R((e, r) => {
				let n = [];
				e.subscribe(
					N(
						r,
						(i) => {
							n.push(i), t < n.length && n.shift();
						},
						() => {
							for (let i of n) r.next(i);
							r.complete();
						},
						void 0,
						() => {
							n = null;
						},
					),
				);
			});
}
function as(t, e) {
	let r = arguments.length >= 2;
	return (n) =>
		n.pipe(
			t ? ue((i, o) => t(i, o, n)) : se,
			Yt(1),
			r ? nt(e) : li(() => new Be()),
		);
}
function us(t, e) {
	return R(Hc(t, e, arguments.length >= 2, !0));
}
function cs(...t) {
	let e = Xe(t);
	return R((r, n) => {
		(e ? Zt(t, r, e) : Zt(t, r)).subscribe(n);
	});
}
function ce(t, e) {
	return R((r, n) => {
		let i = null,
			o = 0,
			s = !1,
			a = () => s && !i && n.complete();
		r.subscribe(
			N(
				n,
				(u) => {
					i?.unsubscribe();
					let c = 0,
						l = o++;
					z(t(u, l)).subscribe(
						(i = N(
							n,
							(d) => n.next(e ? e(u, d, l, c++) : d),
							() => {
								(i = null), a();
							},
						)),
					);
				},
				() => {
					(s = !0), a();
				},
			),
		);
	});
}
function ls(t) {
	return R((e, r) => {
		z(t).subscribe(N(r, () => r.complete(), Vn)),
			!r.closed && e.subscribe(r);
	});
}
function G(t, e, r) {
	let n = _(t) || e || r ? { next: t, error: e, complete: r } : t;
	return n
		? R((i, o) => {
				var s;
				(s = n.subscribe) === null || s === void 0 || s.call(n);
				let a = !0;
				i.subscribe(
					N(
						o,
						(u) => {
							var c;
							(c = n.next) === null ||
								c === void 0 ||
								c.call(n, u),
								o.next(u);
						},
						() => {
							var u;
							(a = !1),
								(u = n.complete) === null ||
									u === void 0 ||
									u.call(n),
								o.complete();
						},
						(u) => {
							var c;
							(a = !1),
								(c = n.error) === null ||
									c === void 0 ||
									c.call(n, u),
								o.error(u);
						},
						() => {
							var u, c;
							a &&
								((u = n.unsubscribe) === null ||
									u === void 0 ||
									u.call(n)),
								(c = n.finalize) === null ||
									c === void 0 ||
									c.call(n);
						},
					),
				);
			})
		: se;
}
function k(t) {
	for (let e in t) if (t[e] === k) return e;
	throw Error("Could not find renamed property on target object.");
}
function di(t, e) {
	for (let r in e)
		e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
function K(t) {
	if (typeof t == "string") return t;
	if (Array.isArray(t)) return "[" + t.map(K).join(", ") + "]";
	if (t == null) return "" + t;
	if (t.overriddenName) return `${t.overriddenName}`;
	if (t.name) return `${t.name}`;
	let e = t.toString();
	if (e == null) return "" + e;
	let r = e.indexOf(`
`);
	return r === -1 ? e : e.substring(0, r);
}
function zc(t, e) {
	return t == null || t === ""
		? e === null
			? ""
			: e
		: e == null || e === ""
			? t
			: t + " " + e;
}
var mg = k({ __forward_ref__: k });
function tr(t) {
	return (
		(t.__forward_ref__ = tr),
		(t.toString = function () {
			return K(this());
		}),
		t
	);
}
function J(t) {
	return Tl(t) ? t() : t;
}
function Tl(t) {
	return (
		typeof t == "function" &&
		t.hasOwnProperty(mg) &&
		t.__forward_ref__ === tr
	);
}
function xl(t) {
	return t && !!t.ɵproviders;
}
var vg = "https://g.co/ng/security#xss",
	C = class extends Error {
		constructor(e, r) {
			super(zi(e, r)), (this.code = e);
		}
	};
function zi(t, e) {
	return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
var yg = k({ ɵcmp: k }),
	Dg = k({ ɵdir: k }),
	Cg = k({ ɵpipe: k }),
	wg = k({ ɵmod: k }),
	Ii = k({ ɵfac: k }),
	jn = k({ __NG_ELEMENT_ID__: k }),
	Gc = k({ __NG_ENV_ID__: k });
function Al(t) {
	return typeof t == "string" ? t : t == null ? "" : String(t);
}
function Eg(t) {
	return typeof t == "function"
		? t.name || t.toString()
		: typeof t == "object" && t != null && typeof t.type == "function"
			? t.type.name || t.type.toString()
			: Al(t);
}
function Ig(t, e) {
	let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
	throw new C(-200, `Circular dependency in DI detected for ${t}${r}`);
}
function ga(t, e) {
	let r = e ? ` in ${e}` : "";
	throw new C(-201, !1);
}
function bg(t, e) {
	t == null && Mg(e, t, null, "!=");
}
function Mg(t, e, r, n) {
	throw new Error(
		`ASSERTION ERROR: ${t}` +
			(n == null ? "" : ` [Expected=> ${r} ${n} ${e} <=Actual]`),
	);
}
function v(t) {
	return {
		token: t.token,
		providedIn: t.providedIn || null,
		factory: t.factory,
		value: void 0,
	};
}
function Ze(t) {
	return { providers: t.providers || [], imports: t.imports || [] };
}
function Gi(t) {
	return Wc(t, Ol) || Wc(t, Rl);
}
function Nl(t) {
	return Gi(t) !== null;
}
function Wc(t, e) {
	return t.hasOwnProperty(e) ? t[e] : null;
}
function _g(t) {
	let e = t && (t[Ol] || t[Rl]);
	return e || null;
}
function qc(t) {
	return t && (t.hasOwnProperty(Zc) || t.hasOwnProperty(Sg)) ? t[Zc] : null;
}
var Ol = k({ ɵprov: k }),
	Zc = k({ ɵinj: k }),
	Rl = k({ ngInjectableDef: k }),
	Sg = k({ ngInjectorDef: k }),
	x = (function (t) {
		return (
			(t[(t.Default = 0)] = "Default"),
			(t[(t.Host = 1)] = "Host"),
			(t[(t.Self = 2)] = "Self"),
			(t[(t.SkipSelf = 4)] = "SkipSelf"),
			(t[(t.Optional = 8)] = "Optional"),
			t
		);
	})(x || {}),
	Ts;
function Tg() {
	return Ts;
}
function ye(t) {
	let e = Ts;
	return (Ts = t), e;
}
function Fl(t, e, r) {
	let n = Gi(t);
	if (n && n.providedIn == "root")
		return n.value === void 0 ? (n.value = n.factory()) : n.value;
	if (r & x.Optional) return null;
	if (e !== void 0) return e;
	ga(K(t), "Injector");
}
var $n = globalThis;
var w = class {
	constructor(e, r) {
		(this._desc = e),
			(this.ngMetadataName = "InjectionToken"),
			(this.ɵprov = void 0),
			typeof r == "number"
				? (this.__NG_ELEMENT_ID__ = r)
				: r !== void 0 &&
					(this.ɵprov = v({
						token: this,
						providedIn: r.providedIn || "root",
						factory: r.factory,
					}));
	}
	get multi() {
		return this;
	}
	toString() {
		return `InjectionToken ${this._desc}`;
	}
};
var xg = {},
	Hn = xg,
	xs = "__NG_DI_FLAG__",
	bi = "ngTempTokenPath",
	Ag = "ngTokenPath",
	Ng = /\n/gm,
	Og = "\u0275",
	Yc = "__source",
	Un;
function rt(t) {
	let e = Un;
	return (Un = t), e;
}
function Rg(t, e = x.Default) {
	if (Un === void 0) throw new C(-203, !1);
	return Un === null
		? Fl(t, void 0, e)
		: Un.get(t, e & x.Optional ? null : void 0, e);
}
function D(t, e = x.Default) {
	return (Tg() || Rg)(J(t), e);
}
function p(t, e = x.Default) {
	return D(t, Wi(e));
}
function Wi(t) {
	return typeof t > "u" || typeof t == "number"
		? t
		: 0 |
				(t.optional && 8) |
				(t.host && 1) |
				(t.self && 2) |
				(t.skipSelf && 4);
}
function As(t) {
	let e = [];
	for (let r = 0; r < t.length; r++) {
		let n = J(t[r]);
		if (Array.isArray(n)) {
			if (n.length === 0) throw new C(900, !1);
			let i,
				o = x.Default;
			for (let s = 0; s < n.length; s++) {
				let a = n[s],
					u = Fg(a);
				typeof u == "number"
					? u === -1
						? (i = a.token)
						: (o |= u)
					: (i = a);
			}
			e.push(D(i, o));
		} else e.push(D(n));
	}
	return e;
}
function Pl(t, e) {
	return (t[xs] = e), (t.prototype[xs] = e), t;
}
function Fg(t) {
	return t[xs];
}
function Pg(t, e, r, n) {
	let i = t[bi];
	throw (
		(e[Yc] && i.unshift(e[Yc]),
		(t.message = kg(
			`
` + t.message,
			i,
			r,
			n,
		)),
		(t[Ag] = i),
		(t[bi] = null),
		t)
	);
}
function kg(t, e, r, n = null) {
	t =
		t &&
		t.charAt(0) ===
			`
` &&
		t.charAt(1) == Og
			? t.slice(2)
			: t;
	let i = K(e);
	if (Array.isArray(e)) i = e.map(K).join(" -> ");
	else if (typeof e == "object") {
		let o = [];
		for (let s in e)
			if (e.hasOwnProperty(s)) {
				let a = e[s];
				o.push(
					s + ":" + (typeof a == "string" ? JSON.stringify(a) : K(a)),
				);
			}
		i = `{${o.join(", ")}}`;
	}
	return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${t.replace(
		Ng,
		`
  `,
	)}`;
}
function nr(t) {
	return { toString: t }.toString();
}
var kl = (function (t) {
		return (
			(t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t
		);
	})(kl || {}),
	ke = (function (t) {
		return (
			(t[(t.Emulated = 0)] = "Emulated"),
			(t[(t.None = 2)] = "None"),
			(t[(t.ShadowDom = 3)] = "ShadowDom"),
			t
		);
	})(ke || {}),
	en = {},
	le = [];
function Ll(t, e, r) {
	let n = t.length;
	for (;;) {
		let i = t.indexOf(e, r);
		if (i === -1) return i;
		if (i === 0 || t.charCodeAt(i - 1) <= 32) {
			let o = e.length;
			if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
		}
		r = i + 1;
	}
}
function Ns(t, e, r) {
	let n = 0;
	for (; n < r.length; ) {
		let i = r[n];
		if (typeof i == "number") {
			if (i !== 0) break;
			n++;
			let o = r[n++],
				s = r[n++],
				a = r[n++];
			t.setAttribute(e, s, a, o);
		} else {
			let o = i,
				s = r[++n];
			Vg(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
		}
	}
	return n;
}
function Lg(t) {
	return t === 3 || t === 4 || t === 6;
}
function Vg(t) {
	return t.charCodeAt(0) === 64;
}
function zn(t, e) {
	if (!(e === null || e.length === 0))
		if (t === null || t.length === 0) t = e.slice();
		else {
			let r = -1;
			for (let n = 0; n < e.length; n++) {
				let i = e[n];
				typeof i == "number"
					? (r = i)
					: r === 0 ||
						(r === -1 || r === 2
							? Qc(t, r, i, null, e[++n])
							: Qc(t, r, i, null, null));
			}
		}
	return t;
}
function Qc(t, e, r, n, i) {
	let o = 0,
		s = t.length;
	if (e === -1) s = -1;
	else
		for (; o < t.length; ) {
			let a = t[o++];
			if (typeof a == "number") {
				if (a === e) {
					s = -1;
					break;
				} else if (a > e) {
					s = o - 1;
					break;
				}
			}
		}
	for (; o < t.length; ) {
		let a = t[o];
		if (typeof a == "number") break;
		if (a === r) {
			if (n === null) {
				i !== null && (t[o + 1] = i);
				return;
			} else if (n === t[o + 1]) {
				t[o + 2] = i;
				return;
			}
		}
		o++, n !== null && o++, i !== null && o++;
	}
	s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
		t.splice(o++, 0, r),
		n !== null && t.splice(o++, 0, n),
		i !== null && t.splice(o++, 0, i);
}
var Vl = "ng-template";
function jg(t, e, r) {
	let n = 0,
		i = !0;
	for (; n < t.length; ) {
		let o = t[n++];
		if (typeof o == "string" && i) {
			let s = t[n++];
			if (r && o === "class" && Ll(s.toLowerCase(), e, 0) !== -1)
				return !0;
		} else if (o === 1) {
			for (; n < t.length && typeof (o = t[n++]) == "string"; )
				if (o.toLowerCase() === e) return !0;
			return !1;
		} else typeof o == "number" && (i = !1);
	}
	return !1;
}
function jl(t) {
	return t.type === 4 && t.value !== Vl;
}
function $g(t, e, r) {
	let n = t.type === 4 && !r ? Vl : t.value;
	return e === n;
}
function Ug(t, e, r) {
	let n = 4,
		i = t.attrs || [],
		o = zg(i),
		s = !1;
	for (let a = 0; a < e.length; a++) {
		let u = e[a];
		if (typeof u == "number") {
			if (!s && !Se(n) && !Se(u)) return !1;
			if (s && Se(u)) continue;
			(s = !1), (n = u | (n & 1));
			continue;
		}
		if (!s)
			if (n & 4) {
				if (
					((n = 2 | (n & 1)),
					(u !== "" && !$g(t, u, r)) || (u === "" && e.length === 1))
				) {
					if (Se(n)) return !1;
					s = !0;
				}
			} else {
				let c = n & 8 ? u : e[++a];
				if (n & 8 && t.attrs !== null) {
					if (!jg(t.attrs, c, r)) {
						if (Se(n)) return !1;
						s = !0;
					}
					continue;
				}
				let l = n & 8 ? "class" : u,
					d = Bg(l, i, jl(t), r);
				if (d === -1) {
					if (Se(n)) return !1;
					s = !0;
					continue;
				}
				if (c !== "") {
					let f;
					d > o ? (f = "") : (f = i[d + 1].toLowerCase());
					let h = n & 8 ? f : null;
					if ((h && Ll(h, c, 0) !== -1) || (n & 2 && c !== f)) {
						if (Se(n)) return !1;
						s = !0;
					}
				}
			}
	}
	return Se(n) || s;
}
function Se(t) {
	return (t & 1) === 0;
}
function Bg(t, e, r, n) {
	if (e === null) return -1;
	let i = 0;
	if (n || !r) {
		let o = !1;
		for (; i < e.length; ) {
			let s = e[i];
			if (s === t) return i;
			if (s === 3 || s === 6) o = !0;
			else if (s === 1 || s === 2) {
				let a = e[++i];
				for (; typeof a == "string"; ) a = e[++i];
				continue;
			} else {
				if (s === 4) break;
				if (s === 0) {
					i += 4;
					continue;
				}
			}
			i += o ? 1 : 2;
		}
		return -1;
	} else return Gg(e, t);
}
function Hg(t, e, r = !1) {
	for (let n = 0; n < e.length; n++) if (Ug(t, e[n], r)) return !0;
	return !1;
}
function zg(t) {
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		if (Lg(r)) return e;
	}
	return t.length;
}
function Gg(t, e) {
	let r = t.indexOf(4);
	if (r > -1)
		for (r++; r < t.length; ) {
			let n = t[r];
			if (typeof n == "number") return -1;
			if (n === e) return r;
			r++;
		}
	return -1;
}
function Kc(t, e) {
	return t ? ":not(" + e.trim() + ")" : e;
}
function Wg(t) {
	let e = t[0],
		r = 1,
		n = 2,
		i = "",
		o = !1;
	for (; r < t.length; ) {
		let s = t[r];
		if (typeof s == "string")
			if (n & 2) {
				let a = t[++r];
				i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
			} else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
		else
			i !== "" && !Se(s) && ((e += Kc(o, i)), (i = "")),
				(n = s),
				(o = o || !Se(n));
		r++;
	}
	return i !== "" && (e += Kc(o, i)), e;
}
function qg(t) {
	return t.map(Wg).join(",");
}
function Zg(t) {
	let e = [],
		r = [],
		n = 1,
		i = 2;
	for (; n < t.length; ) {
		let o = t[n];
		if (typeof o == "string")
			i === 2 ? o !== "" && e.push(o, t[++n]) : i === 8 && r.push(o);
		else {
			if (!Se(i)) break;
			i = o;
		}
		n++;
	}
	return { attrs: e, classes: r };
}
function un(t) {
	return nr(() => {
		let e = zl(t),
			r = j(m({}, e), {
				decls: t.decls,
				vars: t.vars,
				template: t.template,
				consts: t.consts || null,
				ngContentSelectors: t.ngContentSelectors,
				onPush: t.changeDetection === kl.OnPush,
				directiveDefs: null,
				pipeDefs: null,
				dependencies: (e.standalone && t.dependencies) || null,
				getStandaloneInjector: null,
				signals: t.signals ?? !1,
				data: t.data || {},
				encapsulation: t.encapsulation || ke.Emulated,
				styles: t.styles || le,
				_: null,
				schemas: t.schemas || null,
				tView: null,
				id: "",
			});
		Gl(r);
		let n = t.dependencies;
		return (
			(r.directiveDefs = Xc(n, !1)),
			(r.pipeDefs = Xc(n, !0)),
			(r.id = Kg(r)),
			r
		);
	});
}
function Yg(t) {
	return It(t) || $l(t);
}
function Qg(t) {
	return t !== null;
}
function Ye(t) {
	return nr(() => ({
		type: t.type,
		bootstrap: t.bootstrap || le,
		declarations: t.declarations || le,
		imports: t.imports || le,
		exports: t.exports || le,
		transitiveCompileScopes: null,
		schemas: t.schemas || null,
		id: t.id || null,
	}));
}
function Jc(t, e) {
	if (t == null) return en;
	let r = {};
	for (let n in t)
		if (t.hasOwnProperty(n)) {
			let i = t[n],
				o = i;
			Array.isArray(i) && ((o = i[1]), (i = i[0])),
				(r[i] = n),
				e && (e[i] = o);
		}
	return r;
}
function Ae(t) {
	return nr(() => {
		let e = zl(t);
		return Gl(e), e;
	});
}
function It(t) {
	return t[yg] || null;
}
function $l(t) {
	return t[Dg] || null;
}
function Ul(t) {
	return t[Cg] || null;
}
function Bl(t) {
	let e = It(t) || $l(t) || Ul(t);
	return e !== null ? e.standalone : !1;
}
function Hl(t, e) {
	let r = t[wg] || null;
	if (!r && e === !0)
		throw new Error(`Type ${K(t)} does not have '\u0275mod' property.`);
	return r;
}
function zl(t) {
	let e = {};
	return {
		type: t.type,
		providersResolver: null,
		factory: null,
		hostBindings: t.hostBindings || null,
		hostVars: t.hostVars || 0,
		hostAttrs: t.hostAttrs || null,
		contentQueries: t.contentQueries || null,
		declaredInputs: e,
		inputTransforms: null,
		inputConfig: t.inputs || en,
		exportAs: t.exportAs || null,
		standalone: t.standalone === !0,
		signals: t.signals === !0,
		selectors: t.selectors || le,
		viewQuery: t.viewQuery || null,
		features: t.features || null,
		setInput: null,
		findHostDirectiveDefs: null,
		hostDirectives: null,
		inputs: Jc(t.inputs, e),
		outputs: Jc(t.outputs),
		debugInfo: null,
	};
}
function Gl(t) {
	t.features?.forEach((e) => e(t));
}
function Xc(t, e) {
	if (!t) return null;
	let r = e ? Ul : Yg;
	return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter(Qg);
}
function Kg(t) {
	let e = 0,
		r = [
			t.selectors,
			t.ngContentSelectors,
			t.hostVars,
			t.hostAttrs,
			t.consts,
			t.vars,
			t.decls,
			t.encapsulation,
			t.standalone,
			t.signals,
			t.exportAs,
			JSON.stringify(t.inputs),
			JSON.stringify(t.outputs),
			Object.getOwnPropertyNames(t.type.prototype),
			!!t.contentQueries,
			!!t.viewQuery,
		].join("|");
	for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
	return (e += 2147483647 + 1), "c" + e;
}
var fe = 0,
	A = 1,
	I = 2,
	W = 3,
	Te = 4,
	Ne = 5,
	ze = 6,
	Gn = 7,
	Le = 8,
	tn = 9,
	it = 10,
	H = 11,
	Wn = 12,
	el = 13,
	cn = 14,
	De = 15,
	qi = 16,
	Qt = 17,
	qn = 18,
	Zi = 19,
	Wl = 20,
	Bn = 21,
	ds = 22,
	bt = 23,
	he = 25,
	ql = 1,
	Zn = 6,
	Ge = 7,
	Mi = 8,
	_i = 9,
	de = 10,
	nn = (function (t) {
		return (
			(t[(t.None = 0)] = "None"),
			(t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
			(t[(t.HasChildViewsToRefresh = 4)] = "HasChildViewsToRefresh"),
			t
		);
	})(nn || {});
function Pe(t) {
	return Array.isArray(t) && typeof t[ql] == "object";
}
function Ce(t) {
	return Array.isArray(t) && t[ql] === !0;
}
function Zl(t) {
	return (t.flags & 4) !== 0;
}
function rr(t) {
	return t.componentOffset > -1;
}
function ma(t) {
	return (t.flags & 1) === 1;
}
function ot(t) {
	return !!t.template;
}
function Yl(t) {
	return (t[I] & 512) !== 0;
}
function rn(t, e) {
	let r = t.hasOwnProperty(Ii);
	return r ? t[Ii] : null;
}
var Os = class {
	constructor(e, r, n) {
		(this.previousValue = e),
			(this.currentValue = r),
			(this.firstChange = n);
	}
	isFirstChange() {
		return this.firstChange;
	}
};
function ln() {
	return Ql;
}
function Ql(t) {
	return t.type.prototype.ngOnChanges && (t.setInput = Xg), Jg;
}
ln.ngInherit = !0;
function Jg() {
	let t = Jl(this),
		e = t?.current;
	if (e) {
		let r = t.previous;
		if (r === en) t.previous = e;
		else for (let n in e) r[n] = e[n];
		(t.current = null), this.ngOnChanges(e);
	}
}
function Xg(t, e, r, n) {
	let i = this.declaredInputs[r],
		o = Jl(t) || em(t, { previous: en, current: null }),
		s = o.current || (o.current = {}),
		a = o.previous,
		u = a[i];
	(s[i] = new Os(u && u.currentValue, e, a === en)), (t[n] = e);
}
var Kl = "__ngSimpleChanges__";
function Jl(t) {
	return t[Kl] || null;
}
function em(t, e) {
	return (t[Kl] = e);
}
var tl = null;
var Re = function (t, e, r) {
		tl?.(t, e, r);
	},
	tm = "svg",
	nm = "math",
	rm = !1;
function im() {
	return rm;
}
function xe(t) {
	for (; Array.isArray(t); ) t = t[fe];
	return t;
}
function Xl(t, e) {
	return xe(e[t]);
}
function we(t, e) {
	return xe(e[t.index]);
}
function ed(t, e) {
	return t.data[e];
}
function at(t, e) {
	let r = e[t];
	return Pe(r) ? r : r[fe];
}
function va(t) {
	return (t[I] & 128) === 128;
}
function om(t) {
	return Ce(t[W]);
}
function Si(t, e) {
	return e == null ? null : t[e];
}
function td(t) {
	t[Qt] = 0;
}
function sm(t) {
	t[I] & 1024 || ((t[I] |= 1024), va(t) && Yn(t));
}
function am(t, e) {
	for (; t > 0; ) (e = e[cn]), t--;
	return e;
}
function nd(t) {
	return t[I] & 9216 || t[bt]?.dirty;
}
function Rs(t) {
	nd(t)
		? Yn(t)
		: t[I] & 64 &&
			(im()
				? ((t[I] |= 1024), Yn(t))
				: t[it].changeDetectionScheduler?.notify());
}
function Yn(t) {
	t[it].changeDetectionScheduler?.notify();
	let e = t[W];
	for (
		;
		e !== null &&
		!(
			(Ce(e) && e[I] & nn.HasChildViewsToRefresh) ||
			(Pe(e) && e[I] & 8192)
		);

	) {
		if (Ce(e)) e[I] |= nn.HasChildViewsToRefresh;
		else if (((e[I] |= 8192), !va(e))) break;
		e = e[W];
	}
}
function um(t, e) {
	if ((t[I] & 256) === 256) throw new C(911, !1);
	t[Bn] === null && (t[Bn] = []), t[Bn].push(e);
}
var O = { lFrame: ld(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function cm() {
	return O.lFrame.elementDepthCount;
}
function lm() {
	O.lFrame.elementDepthCount++;
}
function dm() {
	O.lFrame.elementDepthCount--;
}
function rd() {
	return O.bindingsEnabled;
}
function ir() {
	return O.skipHydrationRootTNode !== null;
}
function fm(t) {
	return O.skipHydrationRootTNode === t;
}
function hm(t) {
	O.skipHydrationRootTNode = t;
}
function pm() {
	O.skipHydrationRootTNode = null;
}
function Y() {
	return O.lFrame.lView;
}
function Ve() {
	return O.lFrame.tView;
}
function Ee() {
	let t = id();
	for (; t !== null && t.type === 64; ) t = t.parent;
	return t;
}
function id() {
	return O.lFrame.currentTNode;
}
function gm() {
	let t = O.lFrame,
		e = t.currentTNode;
	return t.isParent ? e : e.parent;
}
function or(t, e) {
	let r = O.lFrame;
	(r.currentTNode = t), (r.isParent = e);
}
function od() {
	return O.lFrame.isParent;
}
function mm() {
	O.lFrame.isParent = !1;
}
function vm(t) {
	return (O.lFrame.bindingIndex = t);
}
function sd() {
	return O.lFrame.bindingIndex++;
}
function ym(t) {
	let e = O.lFrame,
		r = e.bindingIndex;
	return (e.bindingIndex = e.bindingIndex + t), r;
}
function Dm() {
	return O.lFrame.inI18n;
}
function Cm(t, e) {
	let r = O.lFrame;
	(r.bindingIndex = r.bindingRootIndex = t), Fs(e);
}
function wm() {
	return O.lFrame.currentDirectiveIndex;
}
function Fs(t) {
	O.lFrame.currentDirectiveIndex = t;
}
function Em(t) {
	let e = O.lFrame.currentDirectiveIndex;
	return e === -1 ? null : t[e];
}
function ad(t) {
	O.lFrame.currentQueryIndex = t;
}
function Im(t) {
	let e = t[A];
	return e.type === 2 ? e.declTNode : e.type === 1 ? t[Ne] : null;
}
function ud(t, e, r) {
	if (r & x.SkipSelf) {
		let i = e,
			o = t;
		for (; (i = i.parent), i === null && !(r & x.Host); )
			if (((i = Im(o)), i === null || ((o = o[cn]), i.type & 10))) break;
		if (i === null) return !1;
		(e = i), (t = o);
	}
	let n = (O.lFrame = cd());
	return (n.currentTNode = e), (n.lView = t), !0;
}
function ya(t) {
	let e = cd(),
		r = t[A];
	(O.lFrame = e),
		(e.currentTNode = r.firstChild),
		(e.lView = t),
		(e.tView = r),
		(e.contextLView = t),
		(e.bindingIndex = r.bindingStartIndex),
		(e.inI18n = !1);
}
function cd() {
	let t = O.lFrame,
		e = t === null ? null : t.child;
	return e === null ? ld(t) : e;
}
function ld(t) {
	let e = {
		currentTNode: null,
		isParent: !0,
		lView: null,
		tView: null,
		selectedIndex: -1,
		contextLView: null,
		elementDepthCount: 0,
		currentNamespace: null,
		currentDirectiveIndex: -1,
		bindingRootIndex: -1,
		bindingIndex: -1,
		currentQueryIndex: 0,
		parent: t,
		child: null,
		inI18n: !1,
	};
	return t !== null && (t.child = e), e;
}
function dd() {
	let t = O.lFrame;
	return (O.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var fd = dd;
function Da() {
	let t = dd();
	(t.isParent = !0),
		(t.tView = null),
		(t.selectedIndex = -1),
		(t.contextLView = null),
		(t.elementDepthCount = 0),
		(t.currentDirectiveIndex = -1),
		(t.currentNamespace = null),
		(t.bindingRootIndex = -1),
		(t.bindingIndex = -1),
		(t.currentQueryIndex = 0);
}
function bm(t) {
	return (O.lFrame.contextLView = am(t, O.lFrame.contextLView))[Le];
}
function dn() {
	return O.lFrame.selectedIndex;
}
function Mt(t) {
	O.lFrame.selectedIndex = t;
}
function Mm() {
	let t = O.lFrame;
	return ed(t.tView, t.selectedIndex);
}
function hd() {
	return O.lFrame.currentNamespace;
}
var pd = !0;
function Ca() {
	return pd;
}
function ut(t) {
	pd = t;
}
function _m(t, e, r) {
	let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
	if (n) {
		let s = Ql(e);
		(r.preOrderHooks ??= []).push(t, s),
			(r.preOrderCheckHooks ??= []).push(t, s);
	}
	i && (r.preOrderHooks ??= []).push(0 - t, i),
		o &&
			((r.preOrderHooks ??= []).push(t, o),
			(r.preOrderCheckHooks ??= []).push(t, o));
}
function wa(t, e) {
	for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
		let o = t.data[r].type.prototype,
			{
				ngAfterContentInit: s,
				ngAfterContentChecked: a,
				ngAfterViewInit: u,
				ngAfterViewChecked: c,
				ngOnDestroy: l,
			} = o;
		s && (t.contentHooks ??= []).push(-r, s),
			a &&
				((t.contentHooks ??= []).push(r, a),
				(t.contentCheckHooks ??= []).push(r, a)),
			u && (t.viewHooks ??= []).push(-r, u),
			c &&
				((t.viewHooks ??= []).push(r, c),
				(t.viewCheckHooks ??= []).push(r, c)),
			l != null && (t.destroyHooks ??= []).push(r, l);
	}
}
function yi(t, e, r) {
	gd(t, e, 3, r);
}
function Di(t, e, r, n) {
	(t[I] & 3) === r && gd(t, e, r, n);
}
function fs(t, e) {
	let r = t[I];
	(r & 3) === e && ((r &= 16383), (r += 1), (t[I] = r));
}
function gd(t, e, r, n) {
	let i = n !== void 0 ? t[Qt] & 65535 : 0,
		o = n ?? -1,
		s = e.length - 1,
		a = 0;
	for (let u = i; u < s; u++)
		if (typeof e[u + 1] == "number") {
			if (((a = e[u]), n != null && a >= n)) break;
		} else
			e[u] < 0 && (t[Qt] += 65536),
				(a < o || o == -1) &&
					(Sm(t, r, e, u), (t[Qt] = (t[Qt] & 4294901760) + u + 2)),
				u++;
}
function nl(t, e) {
	Re(4, t, e);
	let r = oe(null);
	try {
		e.call(t);
	} finally {
		oe(r), Re(5, t, e);
	}
}
function Sm(t, e, r, n) {
	let i = r[n] < 0,
		o = r[n + 1],
		s = i ? -r[n] : r[n],
		a = t[s];
	i
		? t[I] >> 14 < t[Qt] >> 16 &&
			(t[I] & 3) === e &&
			((t[I] += 16384), nl(a, o))
		: nl(a, o);
}
var Xt = -1,
	_t = class {
		constructor(e, r, n) {
			(this.factory = e),
				(this.resolving = !1),
				(this.canSeeViewProviders = r),
				(this.injectImpl = n);
		}
	};
function Tm(t) {
	return t instanceof _t;
}
function xm(t) {
	return (t.flags & 8) !== 0;
}
function Am(t) {
	return (t.flags & 16) !== 0;
}
function md(t) {
	return t !== Xt;
}
function Ti(t) {
	let e = t & 32767;
	return t & 32767;
}
function Nm(t) {
	return t >> 16;
}
function xi(t, e) {
	let r = Nm(t),
		n = e;
	for (; r > 0; ) (n = n[cn]), r--;
	return n;
}
var Ps = !0;
function rl(t) {
	let e = Ps;
	return (Ps = t), e;
}
var Om = 256,
	vd = Om - 1,
	yd = 5,
	Rm = 0,
	Fe = {};
function Fm(t, e, r) {
	let n;
	typeof r == "string"
		? (n = r.charCodeAt(0) || 0)
		: r.hasOwnProperty(jn) && (n = r[jn]),
		n == null && (n = r[jn] = Rm++);
	let i = n & vd,
		o = 1 << i;
	e.data[t + (i >> yd)] |= o;
}
function Ai(t, e) {
	let r = Dd(t, e);
	if (r !== -1) return r;
	let n = e[A];
	n.firstCreatePass &&
		((t.injectorIndex = e.length),
		hs(n.data, t),
		hs(e, null),
		hs(n.blueprint, null));
	let i = Ea(t, e),
		o = t.injectorIndex;
	if (md(i)) {
		let s = Ti(i),
			a = xi(i, e),
			u = a[A].data;
		for (let c = 0; c < 8; c++) e[o + c] = a[s + c] | u[s + c];
	}
	return (e[o + 8] = i), o;
}
function hs(t, e) {
	t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Dd(t, e) {
	return t.injectorIndex === -1 ||
		(t.parent && t.parent.injectorIndex === t.injectorIndex) ||
		e[t.injectorIndex + 8] === null
		? -1
		: t.injectorIndex;
}
function Ea(t, e) {
	if (t.parent && t.parent.injectorIndex !== -1)
		return t.parent.injectorIndex;
	let r = 0,
		n = null,
		i = e;
	for (; i !== null; ) {
		if (((n = bd(i)), n === null)) return Xt;
		if ((r++, (i = i[cn]), n.injectorIndex !== -1))
			return n.injectorIndex | (r << 16);
	}
	return Xt;
}
function ks(t, e, r) {
	Fm(t, e, r);
}
function Cd(t, e, r) {
	if (r & x.Optional || t !== void 0) return t;
	ga(e, "NodeInjector");
}
function wd(t, e, r, n) {
	if (
		(r & x.Optional && n === void 0 && (n = null), !(r & (x.Self | x.Host)))
	) {
		let i = t[tn],
			o = ye(void 0);
		try {
			return i ? i.get(e, n, r & x.Optional) : Fl(e, n, r & x.Optional);
		} finally {
			ye(o);
		}
	}
	return Cd(n, e, r);
}
function Ed(t, e, r, n = x.Default, i) {
	if (t !== null) {
		if (e[I] & 2048 && !(n & x.Self)) {
			let s = jm(t, e, r, n, Fe);
			if (s !== Fe) return s;
		}
		let o = Id(t, e, r, n, Fe);
		if (o !== Fe) return o;
	}
	return wd(e, r, n, i);
}
function Id(t, e, r, n, i) {
	let o = Lm(r);
	if (typeof o == "function") {
		if (!ud(e, t, n)) return n & x.Host ? Cd(i, r, n) : wd(e, r, n, i);
		try {
			let s;
			if (((s = o(n)), s == null && !(n & x.Optional))) ga(r);
			else return s;
		} finally {
			fd();
		}
	} else if (typeof o == "number") {
		let s = null,
			a = Dd(t, e),
			u = Xt,
			c = n & x.Host ? e[De][Ne] : null;
		for (
			(a === -1 || n & x.SkipSelf) &&
			((u = a === -1 ? Ea(t, e) : e[a + 8]),
			u === Xt || !ol(n, !1)
				? (a = -1)
				: ((s = e[A]), (a = Ti(u)), (e = xi(u, e))));
			a !== -1;

		) {
			let l = e[A];
			if (il(o, a, l.data)) {
				let d = Pm(a, e, r, s, n, c);
				if (d !== Fe) return d;
			}
			(u = e[a + 8]),
				u !== Xt && ol(n, e[A].data[a + 8] === c) && il(o, a, e)
					? ((s = l), (a = Ti(u)), (e = xi(u, e)))
					: (a = -1);
		}
	}
	return i;
}
function Pm(t, e, r, n, i, o) {
	let s = e[A],
		a = s.data[t + 8],
		u = n == null ? rr(a) && Ps : n != s && (a.type & 3) !== 0,
		c = i & x.Host && o === a,
		l = km(a, s, r, u, c);
	return l !== null ? on(e, s, l, a) : Fe;
}
function km(t, e, r, n, i) {
	let o = t.providerIndexes,
		s = e.data,
		a = o & 1048575,
		u = t.directiveStart,
		c = t.directiveEnd,
		l = o >> 20,
		d = n ? a : a + l,
		f = i ? a + l : c;
	for (let h = d; h < f; h++) {
		let g = s[h];
		if ((h < u && r === g) || (h >= u && g.type === r)) return h;
	}
	if (i) {
		let h = s[u];
		if (h && ot(h) && h.type === r) return u;
	}
	return null;
}
function on(t, e, r, n) {
	let i = t[r],
		o = e.data;
	if (Tm(i)) {
		let s = i;
		s.resolving && Ig(Eg(o[r]));
		let a = rl(s.canSeeViewProviders);
		s.resolving = !0;
		let u,
			c = s.injectImpl ? ye(s.injectImpl) : null,
			l = ud(t, n, x.Default);
		try {
			(i = t[r] = s.factory(void 0, o, t, n)),
				e.firstCreatePass && r >= n.directiveStart && _m(r, o[r], e);
		} finally {
			c !== null && ye(c), rl(a), (s.resolving = !1), fd();
		}
	}
	return i;
}
function Lm(t) {
	if (typeof t == "string") return t.charCodeAt(0) || 0;
	let e = t.hasOwnProperty(jn) ? t[jn] : void 0;
	return typeof e == "number" ? (e >= 0 ? e & vd : Vm) : e;
}
function il(t, e, r) {
	let n = 1 << t;
	return !!(r[e + (t >> yd)] & n);
}
function ol(t, e) {
	return !(t & x.Self) && !(t & x.Host && e);
}
var Et = class {
	constructor(e, r) {
		(this._tNode = e), (this._lView = r);
	}
	get(e, r, n) {
		return Ed(this._tNode, this._lView, e, Wi(n), r);
	}
};
function Vm() {
	return new Et(Ee(), Y());
}
function sr(t) {
	return nr(() => {
		let e = t.prototype.constructor,
			r = e[Ii] || Ls(e),
			n = Object.prototype,
			i = Object.getPrototypeOf(t.prototype).constructor;
		for (; i && i !== n; ) {
			let o = i[Ii] || Ls(i);
			if (o && o !== r) return o;
			i = Object.getPrototypeOf(i);
		}
		return (o) => new o();
	});
}
function Ls(t) {
	return Tl(t)
		? () => {
				let e = Ls(J(t));
				return e && e();
			}
		: rn(t);
}
function jm(t, e, r, n, i) {
	let o = t,
		s = e;
	for (; o !== null && s !== null && s[I] & 2048 && !(s[I] & 512); ) {
		let a = Id(o, s, r, n | x.Self, Fe);
		if (a !== Fe) return a;
		let u = o.parent;
		if (!u) {
			let c = s[Wl];
			if (c) {
				let l = c.get(r, Fe, n);
				if (l !== Fe) return l;
			}
			(u = bd(s)), (s = s[cn]);
		}
		o = u;
	}
	return i;
}
function bd(t) {
	let e = t[A],
		r = e.type;
	return r === 2 ? e.declTNode : r === 1 ? t[Ne] : null;
}
var fi = "__parameters__";
function $m(t) {
	return function (...r) {
		if (t) {
			let n = t(...r);
			for (let i in n) this[i] = n[i];
		}
	};
}
function Md(t, e, r) {
	return nr(() => {
		let n = $m(e);
		function i(...o) {
			if (this instanceof i) return n.apply(this, o), this;
			let s = new i(...o);
			return (a.annotation = s), a;
			function a(u, c, l) {
				let d = u.hasOwnProperty(fi)
					? u[fi]
					: Object.defineProperty(u, fi, { value: [] })[fi];
				for (; d.length <= l; ) d.push(null);
				return (d[l] = d[l] || []).push(s), u;
			}
		}
		return (
			r && (i.prototype = Object.create(r.prototype)),
			(i.prototype.ngMetadataName = t),
			(i.annotationCls = i),
			i
		);
	});
}
function Um(t) {
	return typeof t == "function";
}
function Ia(t, e) {
	t.forEach((r) => (Array.isArray(r) ? Ia(r, e) : e(r)));
}
function _d(t, e, r) {
	e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function Ni(t, e) {
	return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function Bm(t, e) {
	let r = [];
	for (let n = 0; n < t; n++) r.push(e);
	return r;
}
function Hm(t, e, r, n) {
	let i = t.length;
	if (i == e) t.push(r, n);
	else if (i === 1) t.push(n, t[0]), (t[0] = r);
	else {
		for (i--, t.push(t[i - 1], t[i]); i > e; ) {
			let o = i - 2;
			(t[i] = t[o]), i--;
		}
		(t[e] = r), (t[e + 1] = n);
	}
}
function zm(t, e, r) {
	let n = ar(t, e);
	return n >= 0 ? (t[n | 1] = r) : ((n = ~n), Hm(t, n, e, r)), n;
}
function ps(t, e) {
	let r = ar(t, e);
	if (r >= 0) return t[r | 1];
}
function ar(t, e) {
	return Gm(t, e, 1);
}
function Gm(t, e, r) {
	let n = 0,
		i = t.length >> r;
	for (; i !== n; ) {
		let o = n + ((i - n) >> 1),
			s = t[o << r];
		if (e === s) return o << r;
		s > e ? (i = o) : (n = o + 1);
	}
	return ~(i << r);
}
var ba = Pl(Md("Optional"), 8);
var Sd = Pl(Md("SkipSelf"), 4);
var St = new w("ENVIRONMENT_INITIALIZER"),
	Td = new w("INJECTOR", -1),
	xd = new w("INJECTOR_DEF_TYPES"),
	Oi = class {
		get(e, r = Hn) {
			if (r === Hn) {
				let n = new Error(
					`NullInjectorError: No provider for ${K(e)}!`,
				);
				throw ((n.name = "NullInjectorError"), n);
			}
			return r;
		}
	};
function ct(t) {
	return { ɵproviders: t };
}
function Wm(...t) {
	return { ɵproviders: Ad(!0, t), ɵfromNgModule: !0 };
}
function Ad(t, ...e) {
	let r = [],
		n = new Set(),
		i,
		o = (s) => {
			r.push(s);
		};
	return (
		Ia(e, (s) => {
			let a = s;
			Vs(a, o, [], n) && ((i ||= []), i.push(a));
		}),
		i !== void 0 && Nd(i, o),
		r
	);
}
function Nd(t, e) {
	for (let r = 0; r < t.length; r++) {
		let { ngModule: n, providers: i } = t[r];
		Ma(i, (o) => {
			e(o, n);
		});
	}
}
function Vs(t, e, r, n) {
	if (((t = J(t)), !t)) return !1;
	let i = null,
		o = qc(t),
		s = !o && It(t);
	if (!o && !s) {
		let u = t.ngModule;
		if (((o = qc(u)), o)) i = u;
		else return !1;
	} else {
		if (s && !s.standalone) return !1;
		i = t;
	}
	let a = n.has(i);
	if (s) {
		if (a) return !1;
		if ((n.add(i), s.dependencies)) {
			let u =
				typeof s.dependencies == "function"
					? s.dependencies()
					: s.dependencies;
			for (let c of u) Vs(c, e, r, n);
		}
	} else if (o) {
		if (o.imports != null && !a) {
			n.add(i);
			let c;
			try {
				Ia(o.imports, (l) => {
					Vs(l, e, r, n) && ((c ||= []), c.push(l));
				});
			} finally {
			}
			c !== void 0 && Nd(c, e);
		}
		if (!a) {
			let c = rn(i) || (() => new i());
			e({ provide: i, useFactory: c, deps: le }, i),
				e({ provide: xd, useValue: i, multi: !0 }, i),
				e({ provide: St, useValue: () => D(i), multi: !0 }, i);
		}
		let u = o.providers;
		if (u != null && !a) {
			let c = t;
			Ma(u, (l) => {
				e(l, c);
			});
		}
	} else return !1;
	return i !== t && t.providers !== void 0;
}
function Ma(t, e) {
	for (let r of t)
		xl(r) && (r = r.ɵproviders), Array.isArray(r) ? Ma(r, e) : e(r);
}
var qm = k({ provide: String, useValue: k });
function Od(t) {
	return t !== null && typeof t == "object" && qm in t;
}
function Zm(t) {
	return !!(t && t.useExisting);
}
function Ym(t) {
	return !!(t && t.useFactory);
}
function sn(t) {
	return typeof t == "function";
}
function Qm(t) {
	return !!t.useClass;
}
var Yi = new w("Set Injector scope."),
	Ci = {},
	Km = {},
	gs;
function _a() {
	return gs === void 0 && (gs = new Oi()), gs;
}
var re = class {},
	Qn = class extends re {
		get destroyed() {
			return this._destroyed;
		}
		constructor(e, r, n, i) {
			super(),
				(this.parent = r),
				(this.source = n),
				(this.scopes = i),
				(this.records = new Map()),
				(this._ngOnDestroyHooks = new Set()),
				(this._onDestroyHooks = []),
				(this._destroyed = !1),
				$s(e, (s) => this.processProvider(s)),
				this.records.set(Td, Kt(void 0, this)),
				i.has("environment") && this.records.set(re, Kt(void 0, this));
			let o = this.records.get(Yi);
			o != null && typeof o.value == "string" && this.scopes.add(o.value),
				(this.injectorDefTypes = new Set(this.get(xd, le, x.Self)));
		}
		destroy() {
			this.assertNotDestroyed(), (this._destroyed = !0);
			try {
				for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
				let e = this._onDestroyHooks;
				this._onDestroyHooks = [];
				for (let r of e) r();
			} finally {
				this.records.clear(),
					this._ngOnDestroyHooks.clear(),
					this.injectorDefTypes.clear();
			}
		}
		onDestroy(e) {
			return (
				this.assertNotDestroyed(),
				this._onDestroyHooks.push(e),
				() => this.removeOnDestroy(e)
			);
		}
		runInContext(e) {
			this.assertNotDestroyed();
			let r = rt(this),
				n = ye(void 0),
				i;
			try {
				return e();
			} finally {
				rt(r), ye(n);
			}
		}
		get(e, r = Hn, n = x.Default) {
			if ((this.assertNotDestroyed(), e.hasOwnProperty(Gc)))
				return e[Gc](this);
			n = Wi(n);
			let i,
				o = rt(this),
				s = ye(void 0);
			try {
				if (!(n & x.SkipSelf)) {
					let u = this.records.get(e);
					if (u === void 0) {
						let c = nv(e) && Gi(e);
						c && this.injectableDefInScope(c)
							? (u = Kt(js(e), Ci))
							: (u = null),
							this.records.set(e, u);
					}
					if (u != null) return this.hydrate(e, u);
				}
				let a = n & x.Self ? _a() : this.parent;
				return (r = n & x.Optional && r === Hn ? null : r), a.get(e, r);
			} catch (a) {
				if (a.name === "NullInjectorError") {
					if (((a[bi] = a[bi] || []).unshift(K(e)), o)) throw a;
					return Pg(a, e, "R3InjectorError", this.source);
				} else throw a;
			} finally {
				ye(s), rt(o);
			}
		}
		resolveInjectorInitializers() {
			let e = rt(this),
				r = ye(void 0),
				n;
			try {
				let i = this.get(St, le, x.Self);
				for (let o of i) o();
			} finally {
				rt(e), ye(r);
			}
		}
		toString() {
			let e = [],
				r = this.records;
			for (let n of r.keys()) e.push(K(n));
			return `R3Injector[${e.join(", ")}]`;
		}
		assertNotDestroyed() {
			if (this._destroyed) throw new C(205, !1);
		}
		processProvider(e) {
			e = J(e);
			let r = sn(e) ? e : J(e && e.provide),
				n = Xm(e);
			if (!sn(e) && e.multi === !0) {
				let i = this.records.get(r);
				i ||
					((i = Kt(void 0, Ci, !0)),
					(i.factory = () => As(i.multi)),
					this.records.set(r, i)),
					(r = e),
					i.multi.push(e);
			} else {
				let i = this.records.get(r);
			}
			this.records.set(r, n);
		}
		hydrate(e, r) {
			return (
				r.value === Ci && ((r.value = Km), (r.value = r.factory())),
				typeof r.value == "object" &&
					r.value &&
					tv(r.value) &&
					this._ngOnDestroyHooks.add(r.value),
				r.value
			);
		}
		injectableDefInScope(e) {
			if (!e.providedIn) return !1;
			let r = J(e.providedIn);
			return typeof r == "string"
				? r === "any" || this.scopes.has(r)
				: this.injectorDefTypes.has(r);
		}
		removeOnDestroy(e) {
			let r = this._onDestroyHooks.indexOf(e);
			r !== -1 && this._onDestroyHooks.splice(r, 1);
		}
	};
function js(t) {
	let e = Gi(t),
		r = e !== null ? e.factory : rn(t);
	if (r !== null) return r;
	if (t instanceof w) throw new C(204, !1);
	if (t instanceof Function) return Jm(t);
	throw new C(204, !1);
}
function Jm(t) {
	let e = t.length;
	if (e > 0) {
		let n = Bm(e, "?");
		throw new C(204, !1);
	}
	let r = _g(t);
	return r !== null ? () => r.factory(t) : () => new t();
}
function Xm(t) {
	if (Od(t)) return Kt(void 0, t.useValue);
	{
		let e = Rd(t);
		return Kt(e, Ci);
	}
}
function Rd(t, e, r) {
	let n;
	if (sn(t)) {
		let i = J(t);
		return rn(i) || js(i);
	} else if (Od(t)) n = () => J(t.useValue);
	else if (Ym(t)) n = () => t.useFactory(...As(t.deps || []));
	else if (Zm(t)) n = () => D(J(t.useExisting));
	else {
		let i = J(t && (t.useClass || t.provide));
		if (ev(t)) n = () => new i(...As(t.deps));
		else return rn(i) || js(i);
	}
	return n;
}
function Kt(t, e, r = !1) {
	return { factory: t, value: e, multi: r ? [] : void 0 };
}
function ev(t) {
	return !!t.deps;
}
function tv(t) {
	return (
		t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
	);
}
function nv(t) {
	return typeof t == "function" || (typeof t == "object" && t instanceof w);
}
function $s(t, e) {
	for (let r of t)
		Array.isArray(r) ? $s(r, e) : r && xl(r) ? $s(r.ɵproviders, e) : e(r);
}
function Qe(t, e) {
	t instanceof Qn && t.assertNotDestroyed();
	let r,
		n = rt(t),
		i = ye(void 0);
	try {
		return e();
	} finally {
		rt(n), ye(i);
	}
}
function sl(t, e = null, r = null, n) {
	let i = Fd(t, e, r, n);
	return i.resolveInjectorInitializers(), i;
}
function Fd(t, e = null, r = null, n, i = new Set()) {
	let o = [r || le, Wm(t)];
	return (
		(n = n || (typeof t == "object" ? void 0 : K(t))),
		new Qn(o, e || _a(), n || null, i)
	);
}
var Ke = (() => {
	let e = class e {
		static create(n, i) {
			if (Array.isArray(n)) return sl({ name: "" }, i, n, "");
			{
				let o = n.name ?? "";
				return sl({ name: o }, n.parent, n.providers, o);
			}
		}
	};
	(e.THROW_IF_NOT_FOUND = Hn),
		(e.NULL = new Oi()),
		(e.ɵprov = v({ token: e, providedIn: "any", factory: () => D(Td) })),
		(e.__NG_ELEMENT_ID__ = -1);
	let t = e;
	return t;
})();
var Us;
function Pd(t) {
	Us = t;
}
function Qi() {
	if (Us !== void 0) return Us;
	if (typeof document < "u") return document;
	throw new C(210, !1);
}
var Ki = new w("AppId", { providedIn: "root", factory: () => rv }),
	rv = "ng",
	Sa = new w("Platform Initializer"),
	je = new w("Platform ID", {
		providedIn: "platform",
		factory: () => "unknown",
	});
var Ta = new w("CSP nonce", {
	providedIn: "root",
	factory: () =>
		Qi().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
		null,
});
function iv(t) {
	return t.ownerDocument.body;
}
function kd(t) {
	return t instanceof Function ? t() : t;
}
function hi(t) {
	return (t ?? p(Ke)).get(je) === "browser";
}
var ov = "ngSkipHydration",
	sv = "ngskiphydration";
function Ld(t) {
	let e = t.mergedAttrs;
	if (e === null) return !1;
	for (let r = 0; r < e.length; r += 2) {
		let n = e[r];
		if (typeof n == "number") return !1;
		if (typeof n == "string" && n.toLowerCase() === sv) return !0;
	}
	return !1;
}
function Vd(t) {
	return t.hasAttribute(ov);
}
function Ri(t) {
	return (t.flags & 128) === 128;
}
function av(t) {
	if (Ri(t)) return !0;
	let e = t.parent;
	for (; e; ) {
		if (Ri(t) || Ld(e)) return !0;
		e = e.parent;
	}
	return !1;
}
var We = (function (t) {
		return (
			(t[(t.Important = 1)] = "Important"),
			(t[(t.DashCase = 2)] = "DashCase"),
			t
		);
	})(We || {}),
	uv = /^>|^->|<!--|-->|--!>|<!-$/g,
	cv = /(<|>)/g,
	lv = "\u200B$1\u200B";
function dv(t) {
	return t.replace(uv, (e) => e.replace(cv, lv));
}
var jd = new Map(),
	fv = 0;
function hv() {
	return fv++;
}
function pv(t) {
	jd.set(t[Zi], t);
}
function gv(t) {
	jd.delete(t[Zi]);
}
var al = "__ngContext__";
function Tt(t, e) {
	Pe(e) ? ((t[al] = e[Zi]), pv(e)) : (t[al] = e);
}
var mv;
function xa(t, e) {
	return mv(t, e);
}
function Aa(t) {
	let e = t[W];
	return Ce(e) ? e[W] : e;
}
function $d(t) {
	return Bd(t[Wn]);
}
function Ud(t) {
	return Bd(t[Te]);
}
function Bd(t) {
	for (; t !== null && !Ce(t); ) t = t[Te];
	return t;
}
function Jt(t, e, r, n, i) {
	if (n != null) {
		let o,
			s = !1;
		Ce(n) ? (o = n) : Pe(n) && ((s = !0), (n = n[fe]));
		let a = xe(n);
		t === 0 && r !== null
			? i == null
				? qd(e, r, a)
				: Fi(e, r, a, i || null, !0)
			: t === 1 && r !== null
				? Fi(e, r, a, i || null, !0)
				: t === 2
					? Yd(e, a, s)
					: t === 3 && e.destroyNode(a),
			o != null && Fv(e, t, o, r, i);
	}
}
function Hd(t, e) {
	return t.createText(e);
}
function vv(t, e, r) {
	t.setValue(e, r);
}
function zd(t, e) {
	return t.createComment(dv(e));
}
function Na(t, e, r) {
	return t.createElement(e, r);
}
function yv(t, e) {
	let r = e[H];
	ur(t, e, r, 2, null, null), (e[fe] = null), (e[Ne] = null);
}
function Dv(t, e, r, n, i, o) {
	(n[fe] = i), (n[Ne] = e), ur(t, n, r, 1, i, o);
}
function Cv(t, e) {
	ur(t, e, e[H], 2, null, null);
}
function wv(t) {
	let e = t[Wn];
	if (!e) return ms(t[A], t);
	for (; e; ) {
		let r = null;
		if (Pe(e)) r = e[Wn];
		else {
			let n = e[de];
			n && (r = n);
		}
		if (!r) {
			for (; e && !e[Te] && e !== t; ) Pe(e) && ms(e[A], e), (e = e[W]);
			e === null && (e = t), Pe(e) && ms(e[A], e), (r = e && e[Te]);
		}
		e = r;
	}
}
function Ev(t, e, r, n) {
	let i = de + n,
		o = r.length;
	n > 0 && (r[i - 1][Te] = e),
		n < o - de
			? ((e[Te] = r[i]), _d(r, de + n, e))
			: (r.push(e), (e[Te] = null)),
		(e[W] = r);
	let s = e[qi];
	s !== null && r !== s && Iv(s, e);
	let a = e[qn];
	a !== null && a.insertView(t), Rs(e), (e[I] |= 128);
}
function Iv(t, e) {
	let r = t[_i],
		i = e[W][W][De];
	e[De] !== i && (t[I] |= nn.HasTransplantedViews),
		r === null ? (t[_i] = [e]) : r.push(e);
}
function Gd(t, e) {
	let r = t[_i],
		n = r.indexOf(e),
		i = e[W];
	r.splice(n, 1);
}
function Bs(t, e) {
	if (t.length <= de) return;
	let r = de + e,
		n = t[r];
	if (n) {
		let i = n[qi];
		i !== null && i !== t && Gd(i, n), e > 0 && (t[r - 1][Te] = n[Te]);
		let o = Ni(t, de + e);
		yv(n[A], n);
		let s = o[qn];
		s !== null && s.detachView(o[A]),
			(n[W] = null),
			(n[Te] = null),
			(n[I] &= -129);
	}
	return n;
}
function Wd(t, e) {
	if (!(e[I] & 256)) {
		let r = e[H];
		r.destroyNode && ur(t, e, r, 3, null, null), wv(e);
	}
}
function ms(t, e) {
	if (!(e[I] & 256)) {
		(e[I] &= -129),
			(e[I] |= 256),
			e[bt] && yc(e[bt]),
			Mv(t, e),
			bv(t, e),
			e[A].type === 1 && e[H].destroy();
		let r = e[qi];
		if (r !== null && Ce(e[W])) {
			r !== e[W] && Gd(r, e);
			let n = e[qn];
			n !== null && n.detachView(t);
		}
		gv(e);
	}
}
function bv(t, e) {
	let r = t.cleanup,
		n = e[Gn];
	if (r !== null)
		for (let o = 0; o < r.length - 1; o += 2)
			if (typeof r[o] == "string") {
				let s = r[o + 3];
				s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
			} else {
				let s = n[r[o + 1]];
				r[o].call(s);
			}
	n !== null && (e[Gn] = null);
	let i = e[Bn];
	if (i !== null) {
		e[Bn] = null;
		for (let o = 0; o < i.length; o++) {
			let s = i[o];
			s();
		}
	}
}
function Mv(t, e) {
	let r;
	if (t != null && (r = t.destroyHooks) != null)
		for (let n = 0; n < r.length; n += 2) {
			let i = e[r[n]];
			if (!(i instanceof _t)) {
				let o = r[n + 1];
				if (Array.isArray(o))
					for (let s = 0; s < o.length; s += 2) {
						let a = i[o[s]],
							u = o[s + 1];
						Re(4, a, u);
						try {
							u.call(a);
						} finally {
							Re(5, a, u);
						}
					}
				else {
					Re(4, i, o);
					try {
						o.call(i);
					} finally {
						Re(5, i, o);
					}
				}
			}
		}
}
function _v(t, e, r) {
	return Sv(t, e.parent, r);
}
function Sv(t, e, r) {
	let n = e;
	for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
	if (n === null) return r[fe];
	{
		let { componentOffset: i } = n;
		if (i > -1) {
			let { encapsulation: o } = t.data[n.directiveStart + i];
			if (o === ke.None || o === ke.Emulated) return null;
		}
		return we(n, r);
	}
}
function Fi(t, e, r, n, i) {
	t.insertBefore(e, r, n, i);
}
function qd(t, e, r) {
	t.appendChild(e, r);
}
function ul(t, e, r, n, i) {
	n !== null ? Fi(t, e, r, n, i) : qd(t, e, r);
}
function Tv(t, e, r, n) {
	t.removeChild(e, r, n);
}
function Oa(t, e) {
	return t.parentNode(e);
}
function xv(t, e) {
	return t.nextSibling(e);
}
function Av(t, e, r) {
	return Ov(t, e, r);
}
function Nv(t, e, r) {
	return t.type & 40 ? we(t, r) : null;
}
var Ov = Nv,
	cl;
function Ra(t, e, r, n) {
	let i = _v(t, n, e),
		o = e[H],
		s = n.parent || e[Ne],
		a = Av(s, n, e);
	if (i != null)
		if (Array.isArray(r))
			for (let u = 0; u < r.length; u++) ul(o, i, r[u], a, !1);
		else ul(o, i, r, a, !1);
	cl !== void 0 && cl(o, n, e, r, i);
}
function wi(t, e) {
	if (e !== null) {
		let r = e.type;
		if (r & 3) return we(e, t);
		if (r & 4) return Hs(-1, t[e.index]);
		if (r & 8) {
			let n = e.child;
			if (n !== null) return wi(t, n);
			{
				let i = t[e.index];
				return Ce(i) ? Hs(-1, i) : xe(i);
			}
		} else {
			if (r & 32) return xa(e, t)() || xe(t[e.index]);
			{
				let n = Zd(t, e);
				if (n !== null) {
					if (Array.isArray(n)) return n[0];
					let i = Aa(t[De]);
					return wi(i, n);
				} else return wi(t, e.next);
			}
		}
	}
	return null;
}
function Zd(t, e) {
	if (e !== null) {
		let n = t[De][Ne],
			i = e.projection;
		return n.projection[i];
	}
	return null;
}
function Hs(t, e) {
	let r = de + t + 1;
	if (r < e.length) {
		let n = e[r],
			i = n[A].firstChild;
		if (i !== null) return wi(n, i);
	}
	return e[Ge];
}
function Yd(t, e, r) {
	let n = Oa(t, e);
	n && Tv(t, n, e, r);
}
function Qd(t) {
	t.textContent = "";
}
function Fa(t, e, r, n, i, o, s) {
	for (; r != null; ) {
		let a = n[r.index],
			u = r.type;
		if (
			(s && e === 0 && (a && Tt(xe(a), n), (r.flags |= 2)),
			(r.flags & 32) !== 32)
		)
			if (u & 8) Fa(t, e, r.child, n, i, o, !1), Jt(e, t, i, a, o);
			else if (u & 32) {
				let c = xa(r, n),
					l;
				for (; (l = c()); ) Jt(e, t, i, l, o);
				Jt(e, t, i, a, o);
			} else u & 16 ? Rv(t, e, n, r, i, o) : Jt(e, t, i, a, o);
		r = s ? r.projectionNext : r.next;
	}
}
function ur(t, e, r, n, i, o) {
	Fa(r, n, t.firstChild, e, i, o, !1);
}
function Rv(t, e, r, n, i, o) {
	let s = r[De],
		u = s[Ne].projection[n.projection];
	if (Array.isArray(u))
		for (let c = 0; c < u.length; c++) {
			let l = u[c];
			Jt(e, t, i, l, o);
		}
	else {
		let c = u,
			l = s[W];
		Ri(n) && (c.flags |= 128), Fa(t, e, c, l, i, o, !0);
	}
}
function Fv(t, e, r, n, i) {
	let o = r[Ge],
		s = xe(r);
	o !== s && Jt(e, t, n, o, i);
	for (let a = de; a < r.length; a++) {
		let u = r[a];
		ur(u[A], u, t, e, n, o);
	}
}
function Pv(t, e, r, n, i) {
	if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
	else {
		let o = n.indexOf("-") === -1 ? void 0 : We.DashCase;
		i == null
			? t.removeStyle(r, n, o)
			: (typeof i == "string" &&
					i.endsWith("!important") &&
					((i = i.slice(0, -10)), (o |= We.Important)),
				t.setStyle(r, n, i, o));
	}
}
function kv(t, e, r) {
	t.setAttribute(e, "style", r);
}
function Kd(t, e, r) {
	r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function Jd(t, e, r) {
	let { mergedAttrs: n, classes: i, styles: o } = r;
	n !== null && Ns(t, e, n),
		i !== null && Kd(t, e, i),
		o !== null && kv(t, e, o);
}
var zs = class {
	constructor(e) {
		this.changingThisBreaksApplicationSecurity = e;
	}
	toString() {
		return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${vg})`;
	}
};
function Pa(t) {
	return t instanceof zs ? t.changingThisBreaksApplicationSecurity : t;
}
var Gs = class {};
function Lv() {
	let t = new Nt();
	return p(je) === "browser" && (t.store = Vv(Qi(), p(Ki))), t;
}
var Nt = (() => {
	let e = class e {
		constructor() {
			(this.store = {}), (this.onSerializeCallbacks = {});
		}
		get(n, i) {
			return this.store[n] !== void 0 ? this.store[n] : i;
		}
		set(n, i) {
			this.store[n] = i;
		}
		remove(n) {
			delete this.store[n];
		}
		hasKey(n) {
			return this.store.hasOwnProperty(n);
		}
		get isEmpty() {
			return Object.keys(this.store).length === 0;
		}
		onSerialize(n, i) {
			this.onSerializeCallbacks[n] = i;
		}
		toJson() {
			for (let n in this.onSerializeCallbacks)
				if (this.onSerializeCallbacks.hasOwnProperty(n))
					try {
						this.store[n] = this.onSerializeCallbacks[n]();
					} catch (i) {
						console.warn("Exception in onSerialize callback: ", i);
					}
			return JSON.stringify(this.store).replace(/</g, "\\u003C");
		}
	};
	e.ɵprov = v({ token: e, providedIn: "root", factory: Lv });
	let t = e;
	return t;
})();
function Vv(t, e) {
	let r = t.getElementById(e + "-state");
	if (r?.textContent)
		try {
			return JSON.parse(r.textContent);
		} catch (n) {
			console.warn(
				"Exception while restoring TransferState for app " + e,
				n,
			);
		}
	return {};
}
var Xd = "h",
	ef = "b",
	Ws = (function (t) {
		return (t.FirstChild = "f"), (t.NextSibling = "n"), t;
	})(Ws || {}),
	jv = "e",
	$v = "t",
	ka = "c",
	tf = "x",
	Pi = "r",
	Uv = "i",
	Bv = "n",
	Hv = "d",
	zv = "__nghData__",
	nf = zv,
	vs = "ngh",
	Gv = "nghm",
	rf = (t, e, r) => null;
function Wv(t, e, r = !1) {
	let n = t.getAttribute(vs);
	if (n == null) return null;
	let [i, o] = n.split("|");
	if (((n = r ? o : i), !n)) return null;
	let s = r ? i : o ? `|${o}` : "",
		a = {};
	if (n !== "") {
		let c = e.get(Nt, null, { optional: !0 });
		c !== null && (a = c.get(nf, [])[Number(n)]);
	}
	let u = { data: a, firstChild: t.firstChild ?? null };
	return (
		r && ((u.firstChild = t), Ji(u, 0, t.nextSibling)),
		s ? t.setAttribute(vs, s) : t.removeAttribute(vs),
		u
	);
}
function qv() {
	rf = Wv;
}
function La(t, e, r = !1) {
	return rf(t, e, r);
}
function Zv(t) {
	let e = t._lView;
	return e[A].type === 2 ? null : (Yl(e) && (e = e[he]), e);
}
function Yv(t) {
	return t.textContent?.replace(/\s/gm, "");
}
function Qv(t) {
	let e = Qi(),
		r = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, {
			acceptNode(o) {
				let s = Yv(o);
				return s === "ngetn" || s === "ngtns"
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_REJECT;
			},
		}),
		n,
		i = [];
	for (; (n = r.nextNode()); ) i.push(n);
	for (let o of i)
		o.textContent === "ngetn"
			? o.replaceWith(e.createTextNode(""))
			: o.remove();
}
function Ji(t, e, r) {
	(t.segmentHeads ??= {}), (t.segmentHeads[e] = r);
}
function qs(t, e) {
	return t.segmentHeads?.[e] ?? null;
}
function Kv(t, e) {
	let r = t.data,
		n = r[jv]?.[e] ?? null;
	return n === null && r[ka]?.[e] && (n = Va(t, e)), n;
}
function of(t, e) {
	return t.data[ka]?.[e] ?? null;
}
function Va(t, e) {
	let r = of(t, e) ?? [],
		n = 0;
	for (let i of r) n += i[Pi] * (i[tf] ?? 1);
	return n;
}
function Xi(t, e) {
	if (typeof t.disconnectedNodes > "u") {
		let r = t.data[Hv];
		t.disconnectedNodes = r ? new Set(r) : null;
	}
	return !!t.disconnectedNodes?.has(e);
}
var Zs = class {},
	ki = class {};
function Jv(t) {
	let e = Error(`No component factory found for ${K(t)}.`);
	return (e[Xv] = t), e;
}
var Xv = "ngComponent";
var Ys = class {
		resolveComponentFactory(e) {
			throw Jv(e);
		}
	},
	eo = (() => {
		let e = class e {};
		e.NULL = new Ys();
		let t = e;
		return t;
	})();
function ey() {
	return to(Ee(), Y());
}
function to(t, e) {
	return new Ot(we(t, e));
}
var Ot = (() => {
	let e = class e {
		constructor(n) {
			this.nativeElement = n;
		}
	};
	e.__NG_ELEMENT_ID__ = ey;
	let t = e;
	return t;
})();
var Kn = class {},
	fn = (() => {
		let e = class e {
			constructor() {
				this.destroyNode = null;
			}
		};
		e.__NG_ELEMENT_ID__ = () => ty();
		let t = e;
		return t;
	})();
function ty() {
	let t = Y(),
		e = Ee(),
		r = at(e.index, t);
	return (Pe(r) ? r : t)[H];
}
var ny = (() => {
		let e = class e {};
		e.ɵprov = v({ token: e, providedIn: "root", factory: () => null });
		let t = e;
		return t;
	})(),
	ys = {};
function sf(t) {
	return iy(t)
		? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
		: !1;
}
function ry(t, e) {
	if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
	else {
		let r = t[Symbol.iterator](),
			n;
		for (; !(n = r.next()).done; ) e(n.value);
	}
}
function iy(t) {
	return t !== null && (typeof t == "function" || typeof t == "object");
}
var Qs = class {
		constructor() {}
		supports(e) {
			return sf(e);
		}
		create(e) {
			return new Ks(e);
		}
	},
	oy = (t, e) => e,
	Ks = class {
		constructor(e) {
			(this.length = 0),
				(this._linkedRecords = null),
				(this._unlinkedRecords = null),
				(this._previousItHead = null),
				(this._itHead = null),
				(this._itTail = null),
				(this._additionsHead = null),
				(this._additionsTail = null),
				(this._movesHead = null),
				(this._movesTail = null),
				(this._removalsHead = null),
				(this._removalsTail = null),
				(this._identityChangesHead = null),
				(this._identityChangesTail = null),
				(this._trackByFn = e || oy);
		}
		forEachItem(e) {
			let r;
			for (r = this._itHead; r !== null; r = r._next) e(r);
		}
		forEachOperation(e) {
			let r = this._itHead,
				n = this._removalsHead,
				i = 0,
				o = null;
			for (; r || n; ) {
				let s = !n || (r && r.currentIndex < ll(n, i, o)) ? r : n,
					a = ll(s, i, o),
					u = s.currentIndex;
				if (s === n) i--, (n = n._nextRemoved);
				else if (((r = r._next), s.previousIndex == null)) i++;
				else {
					o || (o = []);
					let c = a - i,
						l = u - i;
					if (c != l) {
						for (let f = 0; f < c; f++) {
							let h = f < o.length ? o[f] : (o[f] = 0),
								g = h + f;
							l <= g && g < c && (o[f] = h + 1);
						}
						let d = s.previousIndex;
						o[d] = l - c;
					}
				}
				a !== u && e(s, a, u);
			}
		}
		forEachPreviousItem(e) {
			let r;
			for (r = this._previousItHead; r !== null; r = r._nextPrevious)
				e(r);
		}
		forEachAddedItem(e) {
			let r;
			for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
		}
		forEachMovedItem(e) {
			let r;
			for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
		}
		forEachRemovedItem(e) {
			let r;
			for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
		}
		forEachIdentityChange(e) {
			let r;
			for (
				r = this._identityChangesHead;
				r !== null;
				r = r._nextIdentityChange
			)
				e(r);
		}
		diff(e) {
			if ((e == null && (e = []), !sf(e))) throw new C(900, !1);
			return this.check(e) ? this : null;
		}
		onDestroy() {}
		check(e) {
			this._reset();
			let r = this._itHead,
				n = !1,
				i,
				o,
				s;
			if (Array.isArray(e)) {
				this.length = e.length;
				for (let a = 0; a < this.length; a++)
					(o = e[a]),
						(s = this._trackByFn(a, o)),
						r === null || !Object.is(r.trackById, s)
							? ((r = this._mismatch(r, o, s, a)), (n = !0))
							: (n && (r = this._verifyReinsertion(r, o, s, a)),
								Object.is(r.item, o) ||
									this._addIdentityChange(r, o)),
						(r = r._next);
			} else
				(i = 0),
					ry(e, (a) => {
						(s = this._trackByFn(i, a)),
							r === null || !Object.is(r.trackById, s)
								? ((r = this._mismatch(r, a, s, i)), (n = !0))
								: (n &&
										(r = this._verifyReinsertion(
											r,
											a,
											s,
											i,
										)),
									Object.is(r.item, a) ||
										this._addIdentityChange(r, a)),
							(r = r._next),
							i++;
					}),
					(this.length = i);
			return this._truncate(r), (this.collection = e), this.isDirty;
		}
		get isDirty() {
			return (
				this._additionsHead !== null ||
				this._movesHead !== null ||
				this._removalsHead !== null ||
				this._identityChangesHead !== null
			);
		}
		_reset() {
			if (this.isDirty) {
				let e;
				for (
					e = this._previousItHead = this._itHead;
					e !== null;
					e = e._next
				)
					e._nextPrevious = e._next;
				for (e = this._additionsHead; e !== null; e = e._nextAdded)
					e.previousIndex = e.currentIndex;
				for (
					this._additionsHead = this._additionsTail = null,
						e = this._movesHead;
					e !== null;
					e = e._nextMoved
				)
					e.previousIndex = e.currentIndex;
				(this._movesHead = this._movesTail = null),
					(this._removalsHead = this._removalsTail = null),
					(this._identityChangesHead = this._identityChangesTail =
						null);
			}
		}
		_mismatch(e, r, n, i) {
			let o;
			return (
				e === null
					? (o = this._itTail)
					: ((o = e._prev), this._remove(e)),
				(e =
					this._unlinkedRecords === null
						? null
						: this._unlinkedRecords.get(n, null)),
				e !== null
					? (Object.is(e.item, r) || this._addIdentityChange(e, r),
						this._reinsertAfter(e, o, i))
					: ((e =
							this._linkedRecords === null
								? null
								: this._linkedRecords.get(n, i)),
						e !== null
							? (Object.is(e.item, r) ||
									this._addIdentityChange(e, r),
								this._moveAfter(e, o, i))
							: (e = this._addAfter(new Js(r, n), o, i))),
				e
			);
		}
		_verifyReinsertion(e, r, n, i) {
			let o =
				this._unlinkedRecords === null
					? null
					: this._unlinkedRecords.get(n, null);
			return (
				o !== null
					? (e = this._reinsertAfter(o, e._prev, i))
					: e.currentIndex != i &&
						((e.currentIndex = i), this._addToMoves(e, i)),
				e
			);
		}
		_truncate(e) {
			for (; e !== null; ) {
				let r = e._next;
				this._addToRemovals(this._unlink(e)), (e = r);
			}
			this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
				this._additionsTail !== null &&
					(this._additionsTail._nextAdded = null),
				this._movesTail !== null && (this._movesTail._nextMoved = null),
				this._itTail !== null && (this._itTail._next = null),
				this._removalsTail !== null &&
					(this._removalsTail._nextRemoved = null),
				this._identityChangesTail !== null &&
					(this._identityChangesTail._nextIdentityChange = null);
		}
		_reinsertAfter(e, r, n) {
			this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
			let i = e._prevRemoved,
				o = e._nextRemoved;
			return (
				i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
				o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
				this._insertAfter(e, r, n),
				this._addToMoves(e, n),
				e
			);
		}
		_moveAfter(e, r, n) {
			return (
				this._unlink(e),
				this._insertAfter(e, r, n),
				this._addToMoves(e, n),
				e
			);
		}
		_addAfter(e, r, n) {
			return (
				this._insertAfter(e, r, n),
				this._additionsTail === null
					? (this._additionsTail = this._additionsHead = e)
					: (this._additionsTail = this._additionsTail._nextAdded =
							e),
				e
			);
		}
		_insertAfter(e, r, n) {
			let i = r === null ? this._itHead : r._next;
			return (
				(e._next = i),
				(e._prev = r),
				i === null ? (this._itTail = e) : (i._prev = e),
				r === null ? (this._itHead = e) : (r._next = e),
				this._linkedRecords === null &&
					(this._linkedRecords = new Li()),
				this._linkedRecords.put(e),
				(e.currentIndex = n),
				e
			);
		}
		_remove(e) {
			return this._addToRemovals(this._unlink(e));
		}
		_unlink(e) {
			this._linkedRecords !== null && this._linkedRecords.remove(e);
			let r = e._prev,
				n = e._next;
			return (
				r === null ? (this._itHead = n) : (r._next = n),
				n === null ? (this._itTail = r) : (n._prev = r),
				e
			);
		}
		_addToMoves(e, r) {
			return (
				e.previousIndex === r ||
					(this._movesTail === null
						? (this._movesTail = this._movesHead = e)
						: (this._movesTail = this._movesTail._nextMoved = e)),
				e
			);
		}
		_addToRemovals(e) {
			return (
				this._unlinkedRecords === null &&
					(this._unlinkedRecords = new Li()),
				this._unlinkedRecords.put(e),
				(e.currentIndex = null),
				(e._nextRemoved = null),
				this._removalsTail === null
					? ((this._removalsTail = this._removalsHead = e),
						(e._prevRemoved = null))
					: ((e._prevRemoved = this._removalsTail),
						(this._removalsTail = this._removalsTail._nextRemoved =
							e)),
				e
			);
		}
		_addIdentityChange(e, r) {
			return (
				(e.item = r),
				this._identityChangesTail === null
					? (this._identityChangesTail = this._identityChangesHead =
							e)
					: (this._identityChangesTail =
							this._identityChangesTail._nextIdentityChange =
								e),
				e
			);
		}
	},
	Js = class {
		constructor(e, r) {
			(this.item = e),
				(this.trackById = r),
				(this.currentIndex = null),
				(this.previousIndex = null),
				(this._nextPrevious = null),
				(this._prev = null),
				(this._next = null),
				(this._prevDup = null),
				(this._nextDup = null),
				(this._prevRemoved = null),
				(this._nextRemoved = null),
				(this._nextAdded = null),
				(this._nextMoved = null),
				(this._nextIdentityChange = null);
		}
	},
	Xs = class {
		constructor() {
			(this._head = null), (this._tail = null);
		}
		add(e) {
			this._head === null
				? ((this._head = this._tail = e),
					(e._nextDup = null),
					(e._prevDup = null))
				: ((this._tail._nextDup = e),
					(e._prevDup = this._tail),
					(e._nextDup = null),
					(this._tail = e));
		}
		get(e, r) {
			let n;
			for (n = this._head; n !== null; n = n._nextDup)
				if (
					(r === null || r <= n.currentIndex) &&
					Object.is(n.trackById, e)
				)
					return n;
			return null;
		}
		remove(e) {
			let r = e._prevDup,
				n = e._nextDup;
			return (
				r === null ? (this._head = n) : (r._nextDup = n),
				n === null ? (this._tail = r) : (n._prevDup = r),
				this._head === null
			);
		}
	},
	Li = class {
		constructor() {
			this.map = new Map();
		}
		put(e) {
			let r = e.trackById,
				n = this.map.get(r);
			n || ((n = new Xs()), this.map.set(r, n)), n.add(e);
		}
		get(e, r) {
			let n = e,
				i = this.map.get(n);
			return i ? i.get(e, r) : null;
		}
		remove(e) {
			let r = e.trackById;
			return this.map.get(r).remove(e) && this.map.delete(r), e;
		}
		get isEmpty() {
			return this.map.size === 0;
		}
		clear() {
			this.map.clear();
		}
	};
function ll(t, e, r) {
	let n = t.previousIndex;
	if (n === null) return n;
	let i = 0;
	return r && n < r.length && (i = r[n]), n + e + i;
}
function dl() {
	return new ja([new Qs()]);
}
var ja = (() => {
	let e = class e {
		constructor(n) {
			this.factories = n;
		}
		static create(n, i) {
			if (i != null) {
				let o = i.factories.slice();
				n = n.concat(o);
			}
			return new e(n);
		}
		static extend(n) {
			return {
				provide: e,
				useFactory: (i) => e.create(n, i || dl()),
				deps: [[e, new Sd(), new ba()]],
			};
		}
		find(n) {
			let i = this.factories.find((o) => o.supports(n));
			if (i != null) return i;
			throw new C(901, !1);
		}
	};
	e.ɵprov = v({ token: e, providedIn: "root", factory: dl });
	let t = e;
	return t;
})();
function Vi(t, e, r, n, i = !1) {
	for (; r !== null; ) {
		let o = e[r.index];
		o !== null && n.push(xe(o)), Ce(o) && sy(o, n);
		let s = r.type;
		if (s & 8) Vi(t, e, r.child, n);
		else if (s & 32) {
			let a = xa(r, e),
				u;
			for (; (u = a()); ) n.push(u);
		} else if (s & 16) {
			let a = Zd(e, r);
			if (Array.isArray(a)) n.push(...a);
			else {
				let u = Aa(e[De]);
				Vi(u[A], u, a, n, !0);
			}
		}
		r = i ? r.projectionNext : r.next;
	}
	return n;
}
function sy(t, e) {
	for (let r = de; r < t.length; r++) {
		let n = t[r],
			i = n[A].firstChild;
		i !== null && Vi(n[A], n, i, e);
	}
	t[Ge] !== t[fe] && e.push(t[Ge]);
}
var af = [];
function ay(t) {
	return t[bt] ?? uy(t);
}
function uy(t) {
	let e = af.pop() ?? Object.create(ly);
	return (e.lView = t), e;
}
function cy(t) {
	t.lView[bt] !== t && ((t.lView = null), af.push(t));
}
var ly = j(m({}, gc), {
		consumerIsAlwaysLive: !0,
		consumerMarkedDirty: (t) => {
			Yn(t.lView);
		},
		consumerOnSignalRead() {
			this.lView[bt] = this;
		},
	}),
	dy = "ngOriginalError";
function Ds(t) {
	return t[dy];
}
var qe = class {
		constructor() {
			this._console = console;
		}
		handleError(e) {
			let r = this._findOriginalError(e);
			this._console.error("ERROR", e),
				r && this._console.error("ORIGINAL ERROR", r);
		}
		_findOriginalError(e) {
			let r = e && Ds(e);
			for (; r && Ds(r); ) r = Ds(r);
			return r || null;
		}
	},
	uf = new w("", {
		providedIn: "root",
		factory: () => p(qe).handleError.bind(void 0),
	}),
	pi = new w(""),
	cf = !1,
	lf = new w("", { providedIn: "root", factory: () => cf });
var hn = {};
function lt(t) {
	df(Ve(), Y(), dn() + t, !1);
}
function df(t, e, r, n) {
	if (!n)
		if ((e[I] & 3) === 3) {
			let o = t.preOrderCheckHooks;
			o !== null && yi(e, o, r);
		} else {
			let o = t.preOrderHooks;
			o !== null && Di(e, o, 0, r);
		}
	Mt(r);
}
function L(t, e = x.Default) {
	let r = Y();
	if (r === null) return D(t, e);
	let n = Ee();
	return Ed(n, r, J(t), e);
}
function fy(t, e) {
	let r = t.hostBindingOpCodes;
	if (r !== null)
		try {
			for (let n = 0; n < r.length; n++) {
				let i = r[n];
				if (i < 0) Mt(~i);
				else {
					let o = i,
						s = r[++n],
						a = r[++n];
					Cm(s, o);
					let u = e[o];
					a(2, u);
				}
			}
		} finally {
			Mt(-1);
		}
}
function no(t, e, r, n, i, o, s, a, u, c, l) {
	let d = e.blueprint.slice();
	return (
		(d[fe] = i),
		(d[I] = n | 4 | 128 | 8 | 64),
		(c !== null || (t && t[I] & 2048)) && (d[I] |= 2048),
		td(d),
		(d[W] = d[cn] = t),
		(d[Le] = r),
		(d[it] = s || (t && t[it])),
		(d[H] = a || (t && t[H])),
		(d[tn] = u || (t && t[tn]) || null),
		(d[Ne] = o),
		(d[Zi] = hv()),
		(d[ze] = l),
		(d[Wl] = c),
		(d[De] = e.type == 2 ? t[De] : d),
		d
	);
}
function ro(t, e, r, n, i) {
	let o = t.data[e];
	if (o === null) (o = hy(t, e, r, n, i)), Dm() && (o.flags |= 32);
	else if (o.type & 64) {
		(o.type = r), (o.value = n), (o.attrs = i);
		let s = gm();
		o.injectorIndex = s === null ? -1 : s.injectorIndex;
	}
	return or(o, !0), o;
}
function hy(t, e, r, n, i) {
	let o = id(),
		s = od(),
		a = s ? o : o && o.parent,
		u = (t.data[e] = Dy(t, a, r, e, n, i));
	return (
		t.firstChild === null && (t.firstChild = u),
		o !== null &&
			(s
				? o.child == null && u.parent !== null && (o.child = u)
				: o.next === null && ((o.next = u), (u.prev = o))),
		u
	);
}
function ff(t, e, r, n) {
	if (r === 0) return -1;
	let i = e.length;
	for (let o = 0; o < r; o++)
		e.push(n), t.blueprint.push(n), t.data.push(null);
	return i;
}
function hf(t, e, r, n, i) {
	let o = dn(),
		s = n & 2;
	try {
		Mt(-1),
			s && e.length > he && df(t, e, he, !1),
			Re(s ? 2 : 0, i),
			r(n, i);
	} finally {
		Mt(o), Re(s ? 3 : 1, i);
	}
}
function pf(t, e, r) {
	if (Zl(e)) {
		let n = oe(null);
		try {
			let i = e.directiveStart,
				o = e.directiveEnd;
			for (let s = i; s < o; s++) {
				let a = t.data[s];
				a.contentQueries && a.contentQueries(1, r[s], s);
			}
		} finally {
			oe(n);
		}
	}
}
function gf(t, e, r) {
	rd() && (_y(t, e, r, we(r, e)), (r.flags & 64) === 64 && wf(t, e, r));
}
function mf(t, e, r = we) {
	let n = e.localNames;
	if (n !== null) {
		let i = e.index + 1;
		for (let o = 0; o < n.length; o += 2) {
			let s = n[o + 1],
				a = s === -1 ? r(e, t) : t[s];
			t[i++] = a;
		}
	}
}
function vf(t) {
	let e = t.tView;
	return e === null || e.incompleteFirstPass
		? (t.tView = $a(
				1,
				null,
				t.template,
				t.decls,
				t.vars,
				t.directiveDefs,
				t.pipeDefs,
				t.viewQuery,
				t.schemas,
				t.consts,
				t.id,
			))
		: e;
}
function $a(t, e, r, n, i, o, s, a, u, c, l) {
	let d = he + n,
		f = d + i,
		h = py(d, f),
		g = typeof c == "function" ? c() : c;
	return (h[A] = {
		type: t,
		blueprint: h,
		template: r,
		queries: null,
		viewQuery: a,
		declTNode: e,
		data: h.slice().fill(null, d),
		bindingStartIndex: d,
		expandoStartIndex: f,
		hostBindingOpCodes: null,
		firstCreatePass: !0,
		firstUpdatePass: !0,
		staticViewQueries: !1,
		staticContentQueries: !1,
		preOrderHooks: null,
		preOrderCheckHooks: null,
		contentHooks: null,
		contentCheckHooks: null,
		viewHooks: null,
		viewCheckHooks: null,
		destroyHooks: null,
		cleanup: null,
		contentQueries: null,
		components: null,
		directiveRegistry: typeof o == "function" ? o() : o,
		pipeRegistry: typeof s == "function" ? s() : s,
		firstChild: null,
		schemas: u,
		consts: g,
		incompleteFirstPass: !1,
		ssrId: l,
	});
}
function py(t, e) {
	let r = [];
	for (let n = 0; n < e; n++) r.push(n < t ? null : hn);
	return r;
}
function gy(t, e, r, n) {
	let o = n.get(lf, cf) || r === ke.ShadowDom,
		s = t.selectRootElement(e, o);
	return my(s), s;
}
function my(t) {
	yf(t);
}
var yf = (t) => null;
function vy(t) {
	Vd(t) ? Qd(t) : Qv(t);
}
function yy() {
	yf = vy;
}
function Dy(t, e, r, n, i, o) {
	let s = e ? e.injectorIndex : -1,
		a = 0;
	return (
		ir() && (a |= 128),
		{
			type: r,
			index: n,
			insertBeforeIndex: null,
			injectorIndex: s,
			directiveStart: -1,
			directiveEnd: -1,
			directiveStylingLast: -1,
			componentOffset: -1,
			propertyBindings: null,
			flags: a,
			providerIndexes: 0,
			value: i,
			attrs: o,
			mergedAttrs: null,
			localNames: null,
			initialInputs: void 0,
			inputs: null,
			outputs: null,
			tView: null,
			next: null,
			prev: null,
			projectionNext: null,
			child: null,
			parent: e,
			projection: null,
			styles: null,
			stylesWithoutHost: null,
			residualStyles: void 0,
			classes: null,
			classesWithoutHost: null,
			residualClasses: void 0,
			classBindings: 0,
			styleBindings: 0,
		}
	);
}
function fl(t, e, r, n) {
	for (let i in t)
		if (t.hasOwnProperty(i)) {
			r = r === null ? {} : r;
			let o = t[i];
			n === null
				? hl(r, e, i, o)
				: n.hasOwnProperty(i) && hl(r, e, n[i], o);
		}
	return r;
}
function hl(t, e, r, n) {
	t.hasOwnProperty(r) ? t[r].push(e, n) : (t[r] = [e, n]);
}
function Cy(t, e, r) {
	let n = e.directiveStart,
		i = e.directiveEnd,
		o = t.data,
		s = e.attrs,
		a = [],
		u = null,
		c = null;
	for (let l = n; l < i; l++) {
		let d = o[l],
			f = r ? r.get(d) : null,
			h = f ? f.inputs : null,
			g = f ? f.outputs : null;
		(u = fl(d.inputs, l, u, h)), (c = fl(d.outputs, l, c, g));
		let T = u !== null && s !== null && !jl(e) ? Py(u, l, s) : null;
		a.push(T);
	}
	u !== null &&
		(u.hasOwnProperty("class") && (e.flags |= 8),
		u.hasOwnProperty("style") && (e.flags |= 16)),
		(e.initialInputs = a),
		(e.inputs = u),
		(e.outputs = c);
}
function wy(t) {
	return t === "class"
		? "className"
		: t === "for"
			? "htmlFor"
			: t === "formaction"
				? "formAction"
				: t === "innerHtml"
					? "innerHTML"
					: t === "readonly"
						? "readOnly"
						: t === "tabindex"
							? "tabIndex"
							: t;
}
function Ey(t, e, r, n, i, o, s, a) {
	let u = we(e, r),
		c = e.inputs,
		l;
	!a && c != null && (l = c[n])
		? (Ua(t, r, l, n, i), rr(e) && Iy(r, e.index))
		: e.type & 3
			? ((n = wy(n)),
				(i = s != null ? s(i, e.value || "", n) : i),
				o.setProperty(u, n, i))
			: e.type & 12;
}
function Iy(t, e) {
	let r = at(e, t);
	r[I] & 16 || (r[I] |= 64);
}
function Df(t, e, r, n) {
	if (rd()) {
		let i = n === null ? null : { "": -1 },
			o = Ty(t, r),
			s,
			a;
		o === null ? (s = a = null) : ([s, a] = o),
			s !== null && Cf(t, e, r, s, i, a),
			i && xy(r, n, i);
	}
	r.mergedAttrs = zn(r.mergedAttrs, r.attrs);
}
function Cf(t, e, r, n, i, o) {
	for (let c = 0; c < n.length; c++) ks(Ai(r, e), t, n[c].type);
	Ny(r, t.data.length, n.length);
	for (let c = 0; c < n.length; c++) {
		let l = n[c];
		l.providersResolver && l.providersResolver(l);
	}
	let s = !1,
		a = !1,
		u = ff(t, e, n.length, null);
	for (let c = 0; c < n.length; c++) {
		let l = n[c];
		(r.mergedAttrs = zn(r.mergedAttrs, l.hostAttrs)),
			Oy(t, r, e, u, l),
			Ay(u, l, i),
			l.contentQueries !== null && (r.flags |= 4),
			(l.hostBindings !== null ||
				l.hostAttrs !== null ||
				l.hostVars !== 0) &&
				(r.flags |= 64);
		let d = l.type.prototype;
		!s &&
			(d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
			((t.preOrderHooks ??= []).push(r.index), (s = !0)),
			!a &&
				(d.ngOnChanges || d.ngDoCheck) &&
				((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
			u++;
	}
	Cy(t, r, o);
}
function by(t, e, r, n, i) {
	let o = i.hostBindings;
	if (o) {
		let s = t.hostBindingOpCodes;
		s === null && (s = t.hostBindingOpCodes = []);
		let a = ~e.index;
		My(s) != a && s.push(a), s.push(r, n, o);
	}
}
function My(t) {
	let e = t.length;
	for (; e > 0; ) {
		let r = t[--e];
		if (typeof r == "number" && r < 0) return r;
	}
	return 0;
}
function _y(t, e, r, n) {
	let i = r.directiveStart,
		o = r.directiveEnd;
	rr(r) && Ry(e, r, t.data[i + r.componentOffset]),
		t.firstCreatePass || Ai(r, e),
		Tt(n, e);
	let s = r.initialInputs;
	for (let a = i; a < o; a++) {
		let u = t.data[a],
			c = on(e, t, a, r);
		if ((Tt(c, e), s !== null && Fy(e, a - i, c, u, r, s), ot(u))) {
			let l = at(r.index, e);
			l[Le] = on(e, t, a, r);
		}
	}
}
function wf(t, e, r) {
	let n = r.directiveStart,
		i = r.directiveEnd,
		o = r.index,
		s = wm();
	try {
		Mt(o);
		for (let a = n; a < i; a++) {
			let u = t.data[a],
				c = e[a];
			Fs(a),
				(u.hostBindings !== null ||
					u.hostVars !== 0 ||
					u.hostAttrs !== null) &&
					Sy(u, c);
		}
	} finally {
		Mt(-1), Fs(s);
	}
}
function Sy(t, e) {
	t.hostBindings !== null && t.hostBindings(1, e);
}
function Ty(t, e) {
	let r = t.directiveRegistry,
		n = null,
		i = null;
	if (r)
		for (let o = 0; o < r.length; o++) {
			let s = r[o];
			if (Hg(e, s.selectors, !1))
				if ((n || (n = []), ot(s)))
					if (s.findHostDirectiveDefs !== null) {
						let a = [];
						(i = i || new Map()),
							s.findHostDirectiveDefs(s, a, i),
							n.unshift(...a, s);
						let u = a.length;
						ea(t, e, u);
					} else n.unshift(s), ea(t, e, 0);
				else
					(i = i || new Map()),
						s.findHostDirectiveDefs?.(s, n, i),
						n.push(s);
		}
	return n === null ? null : [n, i];
}
function ea(t, e, r) {
	(e.componentOffset = r), (t.components ??= []).push(e.index);
}
function xy(t, e, r) {
	if (e) {
		let n = (t.localNames = []);
		for (let i = 0; i < e.length; i += 2) {
			let o = r[e[i + 1]];
			if (o == null) throw new C(-301, !1);
			n.push(e[i], o);
		}
	}
}
function Ay(t, e, r) {
	if (r) {
		if (e.exportAs)
			for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
		ot(e) && (r[""] = t);
	}
}
function Ny(t, e, r) {
	(t.flags |= 1),
		(t.directiveStart = e),
		(t.directiveEnd = e + r),
		(t.providerIndexes = e);
}
function Oy(t, e, r, n, i) {
	t.data[n] = i;
	let o = i.factory || (i.factory = rn(i.type, !0)),
		s = new _t(o, ot(i), L);
	(t.blueprint[n] = s), (r[n] = s), by(t, e, n, ff(t, r, i.hostVars, hn), i);
}
function Ry(t, e, r) {
	let n = we(e, t),
		i = vf(r),
		o = t[it].rendererFactory,
		s = 16;
	r.signals ? (s = 4096) : r.onPush && (s = 64);
	let a = io(
		t,
		no(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null),
	);
	t[e.index] = a;
}
function Fy(t, e, r, n, i, o) {
	let s = o[e];
	if (s !== null)
		for (let a = 0; a < s.length; ) {
			let u = s[a++],
				c = s[a++],
				l = s[a++];
			Ef(n, r, u, c, l);
		}
}
function Ef(t, e, r, n, i) {
	let o = oe(null);
	try {
		let s = t.inputTransforms;
		s !== null && s.hasOwnProperty(n) && (i = s[n].call(e, i)),
			t.setInput !== null ? t.setInput(e, i, r, n) : (e[n] = i);
	} finally {
		oe(o);
	}
}
function Py(t, e, r) {
	let n = null,
		i = 0;
	for (; i < r.length; ) {
		let o = r[i];
		if (o === 0) {
			i += 4;
			continue;
		} else if (o === 5) {
			i += 2;
			continue;
		}
		if (typeof o == "number") break;
		if (t.hasOwnProperty(o)) {
			n === null && (n = []);
			let s = t[o];
			for (let a = 0; a < s.length; a += 2)
				if (s[a] === e) {
					n.push(o, s[a + 1], r[i + 1]);
					break;
				}
		}
		i += 2;
	}
	return n;
}
function If(t, e, r, n) {
	return [t, !0, 0, e, null, n, null, r, null, null];
}
function bf(t, e) {
	let r = t.contentQueries;
	if (r !== null) {
		let n = oe(null);
		try {
			for (let i = 0; i < r.length; i += 2) {
				let o = r[i],
					s = r[i + 1];
				if (s !== -1) {
					let a = t.data[s];
					ad(o), a.contentQueries(2, e[s], s);
				}
			}
		} finally {
			oe(n);
		}
	}
}
function io(t, e) {
	return t[Wn] ? (t[el][Te] = e) : (t[Wn] = e), (t[el] = e), e;
}
function ta(t, e, r) {
	ad(0);
	let n = oe(null);
	try {
		e(t, r);
	} finally {
		oe(n);
	}
}
function ky(t) {
	return t[Gn] || (t[Gn] = []);
}
function Ly(t) {
	return t.cleanup || (t.cleanup = []);
}
function Mf(t, e) {
	let r = t[tn],
		n = r ? r.get(qe, null) : null;
	n && n.handleError(e);
}
function Ua(t, e, r, n, i) {
	for (let o = 0; o < r.length; ) {
		let s = r[o++],
			a = r[o++],
			u = e[s],
			c = t.data[s];
		Ef(c, u, n, a, i);
	}
}
function Vy(t, e, r) {
	let n = Xl(e, t);
	vv(t[H], n, r);
}
var jy = 100;
function $y(t, e = !0) {
	let r = t[it],
		n = r.rendererFactory,
		i = r.afterRenderEventManager,
		o = !1;
	o || (n.begin?.(), i?.begin());
	try {
		Uy(t);
	} catch (s) {
		throw (e && Mf(t, s), s);
	} finally {
		o || (n.end?.(), r.inlineEffectRunner?.flush(), i?.end());
	}
}
function Uy(t) {
	na(t, 0);
	let e = 0;
	for (; nd(t); ) {
		if (e === jy) throw new C(103, !1);
		e++, na(t, 1);
	}
}
function By(t, e, r, n) {
	let i = e[I];
	if ((i & 256) === 256) return;
	let o = !1;
	!o && e[it].inlineEffectRunner?.flush(), ya(e);
	let s = null,
		a = null;
	!o && Hy(t) && ((a = ay(e)), (s = mc(a)));
	try {
		td(e), vm(t.bindingStartIndex), r !== null && hf(t, e, r, 2, n);
		let u = (i & 3) === 3;
		if (!o)
			if (u) {
				let d = t.preOrderCheckHooks;
				d !== null && yi(e, d, null);
			} else {
				let d = t.preOrderHooks;
				d !== null && Di(e, d, 0, null), fs(e, 0);
			}
		if ((zy(e), _f(e, 0), t.contentQueries !== null && bf(t, e), !o))
			if (u) {
				let d = t.contentCheckHooks;
				d !== null && yi(e, d);
			} else {
				let d = t.contentHooks;
				d !== null && Di(e, d, 1), fs(e, 1);
			}
		fy(t, e);
		let c = t.components;
		c !== null && Tf(e, c, 0);
		let l = t.viewQuery;
		if ((l !== null && ta(2, l, n), !o))
			if (u) {
				let d = t.viewCheckHooks;
				d !== null && yi(e, d);
			} else {
				let d = t.viewHooks;
				d !== null && Di(e, d, 2), fs(e, 2);
			}
		if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[ds])) {
			for (let d of e[ds]) d();
			e[ds] = null;
		}
		o || (e[I] &= -73);
	} catch (u) {
		throw (Yn(e), u);
	} finally {
		a !== null && (vc(a, s), cy(a)), Da();
	}
}
function Hy(t) {
	return t.type !== 2;
}
function _f(t, e) {
	for (let r = $d(t); r !== null; r = Ud(r)) {
		r[I] &= ~nn.HasChildViewsToRefresh;
		for (let n = de; n < r.length; n++) {
			let i = r[n];
			Sf(i, e);
		}
	}
}
function zy(t) {
	for (let e = $d(t); e !== null; e = Ud(e)) {
		if (!(e[I] & nn.HasTransplantedViews)) continue;
		let r = e[_i];
		for (let n = 0; n < r.length; n++) {
			let i = r[n],
				o = i[W];
			sm(i);
		}
	}
}
function Gy(t, e, r) {
	let n = at(e, t);
	Sf(n, r);
}
function Sf(t, e) {
	va(t) && na(t, e);
}
function na(t, e) {
	let n = t[A],
		i = t[I],
		o = t[bt],
		s = !!(e === 0 && i & 16);
	if (
		((s ||= !!(i & 64 && e === 0)),
		(s ||= !!(i & 1024)),
		(s ||= !!(o?.dirty && Go(o))),
		o && (o.dirty = !1),
		(t[I] &= -9217),
		s)
	)
		By(n, t, n.template, t[Le]);
	else if (i & 8192) {
		_f(t, 1);
		let a = n.components;
		a !== null && Tf(t, a, 1);
	}
}
function Tf(t, e, r) {
	for (let n = 0; n < e.length; n++) Gy(t, e[n], r);
}
function Ba(t) {
	for (t[it].changeDetectionScheduler?.notify(); t; ) {
		t[I] |= 64;
		let e = Aa(t);
		if (Yl(t) && !e) return t;
		t = e;
	}
	return null;
}
var xt = class {
		get rootNodes() {
			let e = this._lView,
				r = e[A];
			return Vi(r, e, r.firstChild, []);
		}
		constructor(e, r, n = !0) {
			(this._lView = e),
				(this._cdRefInjectingView = r),
				(this.notifyErrorHandler = n),
				(this._appRef = null),
				(this._attachedToViewContainer = !1);
		}
		get context() {
			return this._lView[Le];
		}
		set context(e) {
			this._lView[Le] = e;
		}
		get destroyed() {
			return (this._lView[I] & 256) === 256;
		}
		destroy() {
			if (this._appRef) this._appRef.detachView(this);
			else if (this._attachedToViewContainer) {
				let e = this._lView[W];
				if (Ce(e)) {
					let r = e[Mi],
						n = r ? r.indexOf(this) : -1;
					n > -1 && (Bs(e, n), Ni(r, n));
				}
				this._attachedToViewContainer = !1;
			}
			Wd(this._lView[A], this._lView);
		}
		onDestroy(e) {
			um(this._lView, e);
		}
		markForCheck() {
			Ba(this._cdRefInjectingView || this._lView);
		}
		detach() {
			this._lView[I] &= -129;
		}
		reattach() {
			Rs(this._lView), (this._lView[I] |= 128);
		}
		detectChanges() {
			(this._lView[I] |= 1024), $y(this._lView, this.notifyErrorHandler);
		}
		checkNoChanges() {}
		attachToViewContainerRef() {
			if (this._appRef) throw new C(902, !1);
			this._attachedToViewContainer = !0;
		}
		detachFromAppRef() {
			(this._appRef = null), Cv(this._lView[A], this._lView);
		}
		attachToAppRef(e) {
			if (this._attachedToViewContainer) throw new C(902, !1);
			(this._appRef = e), Rs(this._lView);
		}
	},
	pn = (() => {
		let e = class e {};
		e.__NG_ELEMENT_ID__ = Wy;
		let t = e;
		return t;
	})();
function Wy(t) {
	return qy(Ee(), Y(), (t & 16) === 16);
}
function qy(t, e, r) {
	if (rr(t) && !r) {
		let n = at(t.index, e);
		return new xt(n, n);
	} else if (t.type & 47) {
		let n = e[De];
		return new xt(n, e);
	}
	return null;
}
var pl = new Set();
function cr(t) {
	pl.has(t) ||
		(pl.add(t),
		performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var ra = class extends ae {
	constructor(e = !1) {
		super(), (this.__isAsync = e);
	}
	emit(e) {
		super.next(e);
	}
	subscribe(e, r, n) {
		let i = e,
			o = r || (() => null),
			s = n;
		if (e && typeof e == "object") {
			let u = e;
			(i = u.next?.bind(u)),
				(o = u.error?.bind(u)),
				(s = u.complete?.bind(u));
		}
		this.__isAsync && ((o = Cs(o)), i && (i = Cs(i)), s && (s = Cs(s)));
		let a = super.subscribe({ next: i, error: o, complete: s });
		return e instanceof q && e.add(a), a;
	}
};
function Cs(t) {
	return (e) => {
		setTimeout(t, void 0, e);
	};
}
var X = ra;
function gl(...t) {}
function Zy() {
	let t = typeof $n.requestAnimationFrame == "function",
		e = $n[t ? "requestAnimationFrame" : "setTimeout"],
		r = $n[t ? "cancelAnimationFrame" : "clearTimeout"];
	if (typeof Zone < "u" && e && r) {
		let n = e[Zone.__symbol__("OriginalDelegate")];
		n && (e = n);
		let i = r[Zone.__symbol__("OriginalDelegate")];
		i && (r = i);
	}
	return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var B = class t {
		constructor({
			enableLongStackTrace: e = !1,
			shouldCoalesceEventChangeDetection: r = !1,
			shouldCoalesceRunChangeDetection: n = !1,
		}) {
			if (
				((this.hasPendingMacrotasks = !1),
				(this.hasPendingMicrotasks = !1),
				(this.isStable = !0),
				(this.onUnstable = new X(!1)),
				(this.onMicrotaskEmpty = new X(!1)),
				(this.onStable = new X(!1)),
				(this.onError = new X(!1)),
				typeof Zone > "u")
			)
				throw new C(908, !1);
			Zone.assertZonePatched();
			let i = this;
			(i._nesting = 0),
				(i._outer = i._inner = Zone.current),
				Zone.TaskTrackingZoneSpec &&
					(i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
				e &&
					Zone.longStackTraceZoneSpec &&
					(i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
				(i.shouldCoalesceEventChangeDetection = !n && r),
				(i.shouldCoalesceRunChangeDetection = n),
				(i.lastRequestAnimationFrameId = -1),
				(i.nativeRequestAnimationFrame =
					Zy().nativeRequestAnimationFrame),
				Ky(i);
		}
		static isInAngularZone() {
			return (
				typeof Zone < "u" && Zone.current.get("isAngularZone") === !0
			);
		}
		static assertInAngularZone() {
			if (!t.isInAngularZone()) throw new C(909, !1);
		}
		static assertNotInAngularZone() {
			if (t.isInAngularZone()) throw new C(909, !1);
		}
		run(e, r, n) {
			return this._inner.run(e, r, n);
		}
		runTask(e, r, n, i) {
			let o = this._inner,
				s = o.scheduleEventTask("NgZoneEvent: " + i, e, Yy, gl, gl);
			try {
				return o.runTask(s, r, n);
			} finally {
				o.cancelTask(s);
			}
		}
		runGuarded(e, r, n) {
			return this._inner.runGuarded(e, r, n);
		}
		runOutsideAngular(e) {
			return this._outer.run(e);
		}
	},
	Yy = {};
function Ha(t) {
	if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
		try {
			t._nesting++, t.onMicrotaskEmpty.emit(null);
		} finally {
			if ((t._nesting--, !t.hasPendingMicrotasks))
				try {
					t.runOutsideAngular(() => t.onStable.emit(null));
				} finally {
					t.isStable = !0;
				}
		}
}
function Qy(t) {
	t.isCheckStableRunning ||
		t.lastRequestAnimationFrameId !== -1 ||
		((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
			$n,
			() => {
				t.fakeTopEventTask ||
					(t.fakeTopEventTask = Zone.root.scheduleEventTask(
						"fakeTopEventTask",
						() => {
							(t.lastRequestAnimationFrameId = -1),
								ia(t),
								(t.isCheckStableRunning = !0),
								Ha(t),
								(t.isCheckStableRunning = !1);
						},
						void 0,
						() => {},
						() => {},
					)),
					t.fakeTopEventTask.invoke();
			},
		)),
		ia(t));
}
function Ky(t) {
	let e = () => {
		Qy(t);
	};
	t._inner = t._inner.fork({
		name: "angular",
		properties: { isAngularZone: !0 },
		onInvokeTask: (r, n, i, o, s, a) => {
			if (Jy(a)) return r.invokeTask(i, o, s, a);
			try {
				return ml(t), r.invokeTask(i, o, s, a);
			} finally {
				((t.shouldCoalesceEventChangeDetection &&
					o.type === "eventTask") ||
					t.shouldCoalesceRunChangeDetection) &&
					e(),
					vl(t);
			}
		},
		onInvoke: (r, n, i, o, s, a, u) => {
			try {
				return ml(t), r.invoke(i, o, s, a, u);
			} finally {
				t.shouldCoalesceRunChangeDetection && e(), vl(t);
			}
		},
		onHasTask: (r, n, i, o) => {
			r.hasTask(i, o),
				n === i &&
					(o.change == "microTask"
						? ((t._hasPendingMicrotasks = o.microTask),
							ia(t),
							Ha(t))
						: o.change == "macroTask" &&
							(t.hasPendingMacrotasks = o.macroTask));
		},
		onHandleError: (r, n, i, o) => (
			r.handleError(i, o),
			t.runOutsideAngular(() => t.onError.emit(o)),
			!1
		),
	});
}
function ia(t) {
	t._hasPendingMicrotasks ||
	((t.shouldCoalesceEventChangeDetection ||
		t.shouldCoalesceRunChangeDetection) &&
		t.lastRequestAnimationFrameId !== -1)
		? (t.hasPendingMicrotasks = !0)
		: (t.hasPendingMicrotasks = !1);
}
function ml(t) {
	t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function vl(t) {
	t._nesting--, Ha(t);
}
function Jy(t) {
	return !Array.isArray(t) || t.length !== 1
		? !1
		: t[0].data?.__ignore_ng_zone__ === !0;
}
var Xy = (() => {
	let e = class e {
		constructor() {
			(this.renderDepth = 0),
				(this.handler = null),
				(this.internalCallbacks = []);
		}
		begin() {
			this.handler?.validateBegin(), this.renderDepth++;
		}
		end() {
			if ((this.renderDepth--, this.renderDepth === 0)) {
				for (let n of this.internalCallbacks) n();
				(this.internalCallbacks.length = 0), this.handler?.execute();
			}
		}
		ngOnDestroy() {
			this.handler?.destroy(),
				(this.handler = null),
				(this.internalCallbacks.length = 0);
		}
	};
	e.ɵprov = v({ token: e, providedIn: "root", factory: () => new e() });
	let t = e;
	return t;
})();
function eD(t, e) {
	let r = at(e, t),
		n = r[A];
	tD(n, r);
	let i = r[fe];
	i !== null && r[ze] === null && (r[ze] = La(i, r[tn])), za(n, r, r[Le]);
}
function tD(t, e) {
	for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function za(t, e, r) {
	ya(e);
	try {
		let n = t.viewQuery;
		n !== null && ta(1, n, r);
		let i = t.template;
		i !== null && hf(t, e, i, 1, r),
			t.firstCreatePass && (t.firstCreatePass = !1),
			t.staticContentQueries && bf(t, e),
			t.staticViewQueries && ta(2, t.viewQuery, r);
		let o = t.components;
		o !== null && nD(e, o);
	} catch (n) {
		throw (
			(t.firstCreatePass &&
				((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
			n)
		);
	} finally {
		(e[I] &= -5), Da();
	}
}
function nD(t, e) {
	for (let r = 0; r < e.length; r++) eD(t, e[r]);
}
function oa(t, e, r) {
	let n = r ? t.styles : null,
		i = r ? t.classes : null,
		o = 0;
	if (e !== null)
		for (let s = 0; s < e.length; s++) {
			let a = e[s];
			if (typeof a == "number") o = a;
			else if (o == 1) i = zc(i, a);
			else if (o == 2) {
				let u = a,
					c = e[++s];
				n = zc(n, u + ": " + c + ";");
			}
		}
	r ? (t.styles = n) : (t.stylesWithoutHost = n),
		r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var ji = class extends eo {
	constructor(e) {
		super(), (this.ngModule = e);
	}
	resolveComponentFactory(e) {
		let r = It(e);
		return new Jn(r, this.ngModule);
	}
};
function yl(t) {
	let e = [];
	for (let r in t)
		if (t.hasOwnProperty(r)) {
			let n = t[r];
			e.push({ propName: n, templateName: r });
		}
	return e;
}
function rD(t) {
	let e = t.toLowerCase();
	return e === "svg" ? tm : e === "math" ? nm : null;
}
var sa = class {
		constructor(e, r) {
			(this.injector = e), (this.parentInjector = r);
		}
		get(e, r, n) {
			n = Wi(n);
			let i = this.injector.get(e, ys, n);
			return i !== ys || r === ys ? i : this.parentInjector.get(e, r, n);
		}
	},
	Jn = class extends ki {
		get inputs() {
			let e = this.componentDef,
				r = e.inputTransforms,
				n = yl(e.inputs);
			if (r !== null)
				for (let i of n)
					r.hasOwnProperty(i.propName) &&
						(i.transform = r[i.propName]);
			return n;
		}
		get outputs() {
			return yl(this.componentDef.outputs);
		}
		constructor(e, r) {
			super(),
				(this.componentDef = e),
				(this.ngModule = r),
				(this.componentType = e.type),
				(this.selector = qg(e.selectors)),
				(this.ngContentSelectors = e.ngContentSelectors
					? e.ngContentSelectors
					: []),
				(this.isBoundToModule = !!r);
		}
		create(e, r, n, i) {
			i = i || this.ngModule;
			let o = i instanceof re ? i : i?.injector;
			o &&
				this.componentDef.getStandaloneInjector !== null &&
				(o = this.componentDef.getStandaloneInjector(o) || o);
			let s = o ? new sa(e, o) : e,
				a = s.get(Kn, null);
			if (a === null) throw new C(407, !1);
			let u = s.get(ny, null),
				c = s.get(Xy, null),
				l = s.get(Gs, null),
				d = {
					rendererFactory: a,
					sanitizer: u,
					inlineEffectRunner: null,
					afterRenderEventManager: c,
					changeDetectionScheduler: l,
				},
				f = a.createRenderer(null, this.componentDef),
				h = this.componentDef.selectors[0][0] || "div",
				g = n
					? gy(f, n, this.componentDef.encapsulation, s)
					: Na(f, h, rD(h)),
				T = 512;
			this.componentDef.signals
				? (T |= 4096)
				: this.componentDef.onPush || (T |= 16);
			let b = null;
			g !== null && (b = La(g, s, !0));
			let y = $a(0, null, null, 1, 0, null, null, null, null, null, null),
				U = no(null, y, null, T, null, null, d, f, s, null, b);
			ya(U);
			let me, V;
			try {
				let te = this.componentDef,
					be,
					kn = null;
				te.findHostDirectiveDefs
					? ((be = []),
						(kn = new Map()),
						te.findHostDirectiveDefs(te, be, kn),
						be.push(te))
					: (be = [te]);
				let $p = iD(U, g),
					Up = oD($p, g, te, be, U, d, f);
				(V = ed(y, he)),
					g && uD(f, te, g, n),
					r !== void 0 && cD(V, this.ngContentSelectors, r),
					(me = aD(Up, te, be, kn, U, [lD])),
					za(y, U, null);
			} finally {
				Da();
			}
			return new aa(this.componentType, me, to(V, U), U, V);
		}
	},
	aa = class extends Zs {
		constructor(e, r, n, i, o) {
			super(),
				(this.location = n),
				(this._rootLView = i),
				(this._tNode = o),
				(this.previousInputValues = null),
				(this.instance = r),
				(this.hostView = this.changeDetectorRef =
					new xt(i, void 0, !1)),
				(this.componentType = e);
		}
		setInput(e, r) {
			let n = this._tNode.inputs,
				i;
			if (n !== null && (i = n[e])) {
				if (
					((this.previousInputValues ??= new Map()),
					this.previousInputValues.has(e) &&
						Object.is(this.previousInputValues.get(e), r))
				)
					return;
				let o = this._rootLView;
				Ua(o[A], o, i, e, r), this.previousInputValues.set(e, r);
				let s = at(this._tNode.index, o);
				Ba(s);
			}
		}
		get injector() {
			return new Et(this._tNode, this._rootLView);
		}
		destroy() {
			this.hostView.destroy();
		}
		onDestroy(e) {
			this.hostView.onDestroy(e);
		}
	};
function iD(t, e) {
	let r = t[A],
		n = he;
	return (t[n] = e), ro(r, n, 2, "#host", null);
}
function oD(t, e, r, n, i, o, s) {
	let a = i[A];
	sD(n, t, e, s);
	let u = null;
	e !== null && (u = La(e, i[tn]));
	let c = o.rendererFactory.createRenderer(e, r),
		l = 16;
	r.signals ? (l = 4096) : r.onPush && (l = 64);
	let d = no(i, vf(r), null, l, i[t.index], t, o, c, null, null, u);
	return (
		a.firstCreatePass && ea(a, t, n.length - 1), io(i, d), (i[t.index] = d)
	);
}
function sD(t, e, r, n) {
	for (let i of t) e.mergedAttrs = zn(e.mergedAttrs, i.hostAttrs);
	e.mergedAttrs !== null &&
		(oa(e, e.mergedAttrs, !0), r !== null && Jd(n, r, e));
}
function aD(t, e, r, n, i, o) {
	let s = Ee(),
		a = i[A],
		u = we(s, i);
	Cf(a, i, s, r, null, n);
	for (let l = 0; l < r.length; l++) {
		let d = s.directiveStart + l,
			f = on(i, a, d, s);
		Tt(f, i);
	}
	wf(a, i, s), u && Tt(u, i);
	let c = on(i, a, s.directiveStart + s.componentOffset, s);
	if (((t[Le] = i[Le] = c), o !== null)) for (let l of o) l(c, e);
	return pf(a, s, t), c;
}
function uD(t, e, r, n) {
	if (n) Ns(t, r, ["ng-version", "17.0.8"]);
	else {
		let { attrs: i, classes: o } = Zg(e.selectors[0]);
		i && Ns(t, r, i), o && o.length > 0 && Kd(t, r, o.join(" "));
	}
}
function cD(t, e, r) {
	let n = (t.projection = []);
	for (let i = 0; i < e.length; i++) {
		let o = r[i];
		n.push(o != null ? Array.from(o) : null);
	}
}
function lD() {
	let t = Ee();
	wa(Y()[A], t);
}
function dD(t) {
	return Object.getPrototypeOf(t.prototype).constructor;
}
function gn(t) {
	let e = dD(t.type),
		r = !0,
		n = [t];
	for (; e; ) {
		let i;
		if (ot(t)) i = e.ɵcmp || e.ɵdir;
		else {
			if (e.ɵcmp) throw new C(903, !1);
			i = e.ɵdir;
		}
		if (i) {
			if (r) {
				n.push(i);
				let s = t;
				(s.inputs = gi(t.inputs)),
					(s.inputTransforms = gi(t.inputTransforms)),
					(s.declaredInputs = gi(t.declaredInputs)),
					(s.outputs = gi(t.outputs));
				let a = i.hostBindings;
				a && gD(t, a);
				let u = i.viewQuery,
					c = i.contentQueries;
				if (
					(u && hD(t, u),
					c && pD(t, c),
					di(t.inputs, i.inputs),
					di(t.declaredInputs, i.declaredInputs),
					di(t.outputs, i.outputs),
					i.inputTransforms !== null &&
						(s.inputTransforms === null && (s.inputTransforms = {}),
						di(s.inputTransforms, i.inputTransforms)),
					ot(i) && i.data.animation)
				) {
					let l = t.data;
					l.animation = (l.animation || []).concat(i.data.animation);
				}
			}
			let o = i.features;
			if (o)
				for (let s = 0; s < o.length; s++) {
					let a = o[s];
					a && a.ngInherit && a(t), a === gn && (r = !1);
				}
		}
		e = Object.getPrototypeOf(e);
	}
	fD(n);
}
function fD(t) {
	let e = 0,
		r = null;
	for (let n = t.length - 1; n >= 0; n--) {
		let i = t[n];
		(i.hostVars = e += i.hostVars),
			(i.hostAttrs = zn(i.hostAttrs, (r = zn(r, i.hostAttrs))));
	}
}
function gi(t) {
	return t === en ? {} : t === le ? [] : t;
}
function hD(t, e) {
	let r = t.viewQuery;
	r
		? (t.viewQuery = (n, i) => {
				e(n, i), r(n, i);
			})
		: (t.viewQuery = e);
}
function pD(t, e) {
	let r = t.contentQueries;
	r
		? (t.contentQueries = (n, i, o) => {
				e(n, i, o), r(n, i, o);
			})
		: (t.contentQueries = e);
}
function gD(t, e) {
	let r = t.hostBindings;
	r
		? (t.hostBindings = (n, i) => {
				e(n, i), r(n, i);
			})
		: (t.hostBindings = e);
}
function Ga(t, e, r) {
	let n = t[e];
	return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function mD(t, e, r, n) {
	return Ga(t, sd(), r) ? e + Al(r) + n : hn;
}
function mi(t, e) {
	return (t << 17) | (e << 2);
}
function At(t) {
	return (t >> 17) & 32767;
}
function vD(t) {
	return (t & 2) == 2;
}
function yD(t, e) {
	return (t & 131071) | (e << 17);
}
function ua(t) {
	return t | 2;
}
function an(t) {
	return (t & 131068) >> 2;
}
function ws(t, e) {
	return (t & -131069) | (e << 2);
}
function DD(t) {
	return (t & 1) === 1;
}
function ca(t) {
	return t | 1;
}
function CD(t, e, r, n, i, o) {
	let s = o ? e.classBindings : e.styleBindings,
		a = At(s),
		u = an(s);
	t[n] = r;
	let c = !1,
		l;
	if (Array.isArray(r)) {
		let d = r;
		(l = d[1]), (l === null || ar(d, l) > 0) && (c = !0);
	} else l = r;
	if (i)
		if (u !== 0) {
			let f = At(t[a + 1]);
			(t[n + 1] = mi(f, a)),
				f !== 0 && (t[f + 1] = ws(t[f + 1], n)),
				(t[a + 1] = yD(t[a + 1], n));
		} else
			(t[n + 1] = mi(a, 0)),
				a !== 0 && (t[a + 1] = ws(t[a + 1], n)),
				(a = n);
	else
		(t[n + 1] = mi(u, 0)),
			a === 0 ? (a = n) : (t[u + 1] = ws(t[u + 1], n)),
			(u = n);
	c && (t[n + 1] = ua(t[n + 1])),
		Dl(t, l, n, !0, o),
		Dl(t, l, n, !1, o),
		wD(e, l, t, n, o),
		(s = mi(a, u)),
		o ? (e.classBindings = s) : (e.styleBindings = s);
}
function wD(t, e, r, n, i) {
	let o = i ? t.residualClasses : t.residualStyles;
	o != null &&
		typeof e == "string" &&
		ar(o, e) >= 0 &&
		(r[n + 1] = ca(r[n + 1]));
}
function Dl(t, e, r, n, i) {
	let o = t[r + 1],
		s = e === null,
		a = n ? At(o) : an(o),
		u = !1;
	for (; a !== 0 && (u === !1 || s); ) {
		let c = t[a],
			l = t[a + 1];
		ED(c, e) && ((u = !0), (t[a + 1] = n ? ca(l) : ua(l))),
			(a = n ? At(l) : an(l));
	}
	u && (t[r + 1] = n ? ua(o) : ca(o));
}
function ED(t, e) {
	return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
		? !0
		: Array.isArray(t) && typeof e == "string"
			? ar(t, e) >= 0
			: !1;
}
function mn(t, e, r) {
	let n = Y(),
		i = sd();
	if (Ga(n, i, e)) {
		let o = Ve(),
			s = Mm();
		Ey(o, s, n, t, e, n[H], r, !1);
	}
	return mn;
}
function Cl(t, e, r, n, i) {
	let o = e.inputs,
		s = i ? "class" : "style";
	Ua(t, r, o[s], s, n);
}
function Wa(t, e) {
	return ID(t, e, null, !0), Wa;
}
function ID(t, e, r, n) {
	let i = Y(),
		o = Ve(),
		s = ym(2);
	if ((o.firstUpdatePass && MD(o, t, s, n), e !== hn && Ga(i, s, e))) {
		let a = o.data[dn()];
		AD(o, a, i, i[H], t, (i[s + 1] = ND(e, r)), n, s);
	}
}
function bD(t, e) {
	return e >= t.expandoStartIndex;
}
function MD(t, e, r, n) {
	let i = t.data;
	if (i[r + 1] === null) {
		let o = i[dn()],
			s = bD(t, r);
		OD(o, n) && e === null && !s && (e = !1),
			(e = _D(i, o, e, n)),
			CD(i, o, e, r, s, n);
	}
}
function _D(t, e, r, n) {
	let i = Em(t),
		o = n ? e.residualClasses : e.residualStyles;
	if (i === null)
		(n ? e.classBindings : e.styleBindings) === 0 &&
			((r = Es(null, t, e, r, n)), (r = Xn(r, e.attrs, n)), (o = null));
	else {
		let s = e.directiveStylingLast;
		if (s === -1 || t[s] !== i)
			if (((r = Es(i, t, e, r, n)), o === null)) {
				let u = SD(t, e, n);
				u !== void 0 &&
					Array.isArray(u) &&
					((u = Es(null, t, e, u[1], n)),
					(u = Xn(u, e.attrs, n)),
					TD(t, e, n, u));
			} else o = xD(t, e, n);
	}
	return (
		o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)),
		r
	);
}
function SD(t, e, r) {
	let n = r ? e.classBindings : e.styleBindings;
	if (an(n) !== 0) return t[At(n)];
}
function TD(t, e, r, n) {
	let i = r ? e.classBindings : e.styleBindings;
	t[At(i)] = n;
}
function xD(t, e, r) {
	let n,
		i = e.directiveEnd;
	for (let o = 1 + e.directiveStylingLast; o < i; o++) {
		let s = t[o].hostAttrs;
		n = Xn(n, s, r);
	}
	return Xn(n, e.attrs, r);
}
function Es(t, e, r, n, i) {
	let o = null,
		s = r.directiveEnd,
		a = r.directiveStylingLast;
	for (
		a === -1 ? (a = r.directiveStart) : a++;
		a < s && ((o = e[a]), (n = Xn(n, o.hostAttrs, i)), o !== t);

	)
		a++;
	return t !== null && (r.directiveStylingLast = a), n;
}
function Xn(t, e, r) {
	let n = r ? 1 : 2,
		i = -1;
	if (e !== null)
		for (let o = 0; o < e.length; o++) {
			let s = e[o];
			typeof s == "number"
				? (i = s)
				: i === n &&
					(Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
					zm(t, s, r ? !0 : e[++o]));
		}
	return t === void 0 ? null : t;
}
function AD(t, e, r, n, i, o, s, a) {
	if (!(e.type & 3)) return;
	let u = t.data,
		c = u[a + 1],
		l = DD(c) ? wl(u, e, r, i, an(c), s) : void 0;
	if (!$i(l)) {
		$i(o) || (vD(c) && (o = wl(u, null, r, i, a, s)));
		let d = Xl(dn(), r);
		Pv(n, s, d, i, o);
	}
}
function wl(t, e, r, n, i, o) {
	let s = e === null,
		a;
	for (; i > 0; ) {
		let u = t[i],
			c = Array.isArray(u),
			l = c ? u[1] : u,
			d = l === null,
			f = r[i + 1];
		f === hn && (f = d ? le : void 0);
		let h = d ? ps(f, n) : l === n ? f : void 0;
		if ((c && !$i(h) && (h = ps(u, n)), $i(h) && ((a = h), s))) return a;
		let g = t[i + 1];
		i = s ? At(g) : an(g);
	}
	if (e !== null) {
		let u = o ? e.residualClasses : e.residualStyles;
		u != null && (a = ps(u, n));
	}
	return a;
}
function $i(t) {
	return t !== void 0;
}
function ND(t, e) {
	return (
		t == null ||
			t === "" ||
			(typeof e == "string"
				? (t = t + e)
				: typeof t == "object" && (t = K(Pa(t)))),
		t
	);
}
function OD(t, e) {
	return (t.flags & (e ? 8 : 16)) !== 0;
}
function xf(t) {
	let e = t[Zn] ?? [],
		n = t[W][H];
	for (let i of e) RD(i, n);
	t[Zn] = le;
}
function RD(t, e) {
	let r = 0,
		n = t.firstChild;
	if (n) {
		let i = t.data[Pi];
		for (; r < i; ) {
			let o = n.nextSibling;
			Yd(e, n, !1), (n = o), r++;
		}
	}
}
function Af(t) {
	xf(t);
	for (let e = de; e < t.length; e++) Ui(t[e]);
}
function Ui(t) {
	let e = t[A];
	for (let r = he; r < e.bindingStartIndex; r++)
		if (Ce(t[r])) {
			let n = t[r];
			Af(n);
		} else Pe(t[r]) && Ui(t[r]);
}
function FD(t) {
	let e = t._views;
	for (let r of e) {
		let n = Zv(r);
		if (n !== null && n[fe] !== null)
			if (Pe(n)) Ui(n);
			else {
				let i = n[fe];
				Ui(i), Af(n);
			}
	}
}
var PD = new RegExp(`^(\\d+)*(${ef}|${Xd})*(.*)`);
function kD(t) {
	let e = t.match(PD),
		[r, n, i, o] = e,
		s = n ? parseInt(n, 10) : i,
		a = [];
	for (let [u, c, l] of o.matchAll(/(f|n)(\d*)/g)) {
		let d = parseInt(l, 10) || 1;
		a.push(c, d);
	}
	return [s, ...a];
}
function LD(t) {
	return !t.prev && t.parent?.type === 8;
}
function Is(t) {
	return t.index - he;
}
function oo(t, e, r, n) {
	let i = null,
		o = Is(n),
		s = t.data[Bv];
	if (s?.[o]) i = jD(s[o], r);
	else if (e.firstChild === n) i = t.firstChild;
	else {
		let a = n.prev === null,
			u = n.prev ?? n.parent;
		if (LD(n)) {
			let c = Is(n.parent);
			i = qs(t, c);
		} else {
			let c = we(u, r);
			if (a) i = c.firstChild;
			else {
				let l = Is(u),
					d = qs(t, l);
				if (u.type === 2 && d) {
					let h = Va(t, l) + 1;
					i = so(h, d);
				} else i = c.nextSibling;
			}
		}
	}
	return i;
}
function so(t, e) {
	let r = e;
	for (let n = 0; n < t; n++) r = r.nextSibling;
	return r;
}
function VD(t, e) {
	let r = t;
	for (let n = 0; n < e.length; n += 2) {
		let i = e[n],
			o = e[n + 1];
		for (let s = 0; s < o; s++)
			switch (i) {
				case Ws.FirstChild:
					r = r.firstChild;
					break;
				case Ws.NextSibling:
					r = r.nextSibling;
					break;
			}
	}
	return r;
}
function jD(t, e) {
	let [r, ...n] = kD(t),
		i;
	if (r === Xd) i = e[De][fe];
	else if (r === ef) i = iv(e[De][fe]);
	else {
		let o = Number(r);
		i = xe(e[o + he]);
	}
	return VD(i, n);
}
function $D(t, e) {
	let r = [];
	for (let n of e)
		for (let i = 0; i < (n[tf] ?? 1); i++) {
			let o = { data: n, firstChild: null };
			n[Pi] > 0 && ((o.firstChild = t), (t = so(n[Pi], t))), r.push(o);
		}
	return [t, r];
}
var Nf = (t, e) => null;
function UD(t, e) {
	let r = t[Zn];
	return !e || r === null || r.length === 0
		? null
		: r[0].data[Uv] === e
			? r.shift()
			: (xf(t), null);
}
function BD() {
	Nf = UD;
}
function El(t, e) {
	return Nf(t, e);
}
function HD(t, e, r, n) {
	let i = e.tView,
		s = t[I] & 4096 ? 4096 : 16,
		a = no(
			t,
			i,
			r,
			s,
			null,
			e,
			null,
			null,
			null,
			n?.injector ?? null,
			n?.dehydratedView ?? null,
		),
		u = t[e.index];
	a[qi] = u;
	let c = t[qn];
	return c !== null && (a[qn] = c.createEmbeddedView(i)), za(i, a, r), a;
}
function Il(t, e) {
	return !e || e.firstChild === null || Ri(t);
}
function zD(t, e, r, n = !0) {
	let i = e[A];
	if ((Ev(i, e, t, r), n)) {
		let s = Hs(r, t),
			a = e[H],
			u = Oa(a, t[Ge]);
		u !== null && Dv(i, t[Ne], a, e, u, s);
	}
	let o = e[ze];
	o !== null && o.firstChild !== null && (o.firstChild = null);
}
var vn = (() => {
	let e = class e {};
	e.__NG_ELEMENT_ID__ = GD;
	let t = e;
	return t;
})();
function GD() {
	let t = Ee();
	return qD(t, Y());
}
var WD = vn,
	Of = class extends WD {
		constructor(e, r, n) {
			super(),
				(this._lContainer = e),
				(this._hostTNode = r),
				(this._hostLView = n);
		}
		get element() {
			return to(this._hostTNode, this._hostLView);
		}
		get injector() {
			return new Et(this._hostTNode, this._hostLView);
		}
		get parentInjector() {
			let e = Ea(this._hostTNode, this._hostLView);
			if (md(e)) {
				let r = xi(e, this._hostLView),
					n = Ti(e),
					i = r[A].data[n + 8];
				return new Et(i, r);
			} else return new Et(null, this._hostLView);
		}
		clear() {
			for (; this.length > 0; ) this.remove(this.length - 1);
		}
		get(e) {
			let r = bl(this._lContainer);
			return (r !== null && r[e]) || null;
		}
		get length() {
			return this._lContainer.length - de;
		}
		createEmbeddedView(e, r, n) {
			let i, o;
			typeof n == "number"
				? (i = n)
				: n != null && ((i = n.index), (o = n.injector));
			let s = El(this._lContainer, e.ssrId),
				a = e.createEmbeddedViewImpl(r || {}, o, s);
			return this.insertImpl(a, i, Il(this._hostTNode, s)), a;
		}
		createComponent(e, r, n, i, o) {
			let s = e && !Um(e),
				a;
			if (s) a = r;
			else {
				let g = r || {};
				(a = g.index),
					(n = g.injector),
					(i = g.projectableNodes),
					(o = g.environmentInjector || g.ngModuleRef);
			}
			let u = s ? e : new Jn(It(e)),
				c = n || this.parentInjector;
			if (!o && u.ngModule == null) {
				let T = (s ? c : this.parentInjector).get(re, null);
				T && (o = T);
			}
			let l = It(u.componentType ?? {}),
				d = El(this._lContainer, l?.id ?? null),
				f = d?.firstChild ?? null,
				h = u.create(c, i, f, o);
			return this.insertImpl(h.hostView, a, Il(this._hostTNode, d)), h;
		}
		insert(e, r) {
			return this.insertImpl(e, r, !0);
		}
		insertImpl(e, r, n) {
			let i = e._lView;
			if (om(i)) {
				let a = this.indexOf(e);
				if (a !== -1) this.detach(a);
				else {
					let u = i[W],
						c = new Of(u, u[Ne], u[W]);
					c.detach(c.indexOf(e));
				}
			}
			let o = this._adjustIndex(r),
				s = this._lContainer;
			return (
				zD(s, i, o, n), e.attachToViewContainerRef(), _d(bs(s), o, e), e
			);
		}
		move(e, r) {
			return this.insert(e, r);
		}
		indexOf(e) {
			let r = bl(this._lContainer);
			return r !== null ? r.indexOf(e) : -1;
		}
		remove(e) {
			let r = this._adjustIndex(e, -1),
				n = Bs(this._lContainer, r);
			n && (Ni(bs(this._lContainer), r), Wd(n[A], n));
		}
		detach(e) {
			let r = this._adjustIndex(e, -1),
				n = Bs(this._lContainer, r);
			return n && Ni(bs(this._lContainer), r) != null ? new xt(n) : null;
		}
		_adjustIndex(e, r = 0) {
			return e ?? this.length + r;
		}
	};
function bl(t) {
	return t[Mi];
}
function bs(t) {
	return t[Mi] || (t[Mi] = []);
}
function qD(t, e) {
	let r,
		n = e[t.index];
	return (
		Ce(n) ? (r = n) : ((r = If(n, e, null, t)), (e[t.index] = r), io(e, r)),
		Rf(r, e, t, n),
		new Of(r, t, e)
	);
}
function ZD(t, e) {
	let r = t[H],
		n = r.createComment(""),
		i = we(e, t),
		o = Oa(r, i);
	return Fi(r, o, n, xv(r, i), !1), n;
}
var Rf = Ff,
	qa = (t, e, r) => !1;
function YD(t, e, r) {
	return qa(t, e, r);
}
function Ff(t, e, r, n) {
	if (t[Ge]) return;
	let i;
	r.type & 8 ? (i = xe(n)) : (i = ZD(e, r)), (t[Ge] = i);
}
function QD(t, e, r) {
	if (t[Ge] && t[Zn]) return !0;
	let n = r[ze],
		i = e.index - he;
	if (!n || av(e) || Xi(n, i)) return !1;
	let s = qs(n, i),
		a = n.data[ka]?.[i],
		[u, c] = $D(s, a);
	return (t[Ge] = u), (t[Zn] = c), !0;
}
function KD(t, e, r, n) {
	qa(t, r, e) || Ff(t, e, r, n);
}
function JD() {
	(Rf = KD), (qa = QD);
}
function XD(t, e, r, n, i, o, s, a, u) {
	let c = e.consts,
		l = ro(e, t, 4, s || null, Si(c, a));
	Df(e, r, l, Si(c, u)), wa(e, l);
	let d = (l.tView = $a(
		2,
		l,
		n,
		i,
		o,
		e.directiveRegistry,
		e.pipeRegistry,
		null,
		e.schemas,
		c,
		null,
	));
	return (
		e.queries !== null &&
			(e.queries.template(e, l),
			(d.queries = e.queries.embeddedTView(l))),
		l
	);
}
function lr(t, e, r, n, i, o, s, a) {
	let u = Y(),
		c = Ve(),
		l = t + he,
		d = c.firstCreatePass ? XD(l, c, u, e, r, n, i, o, s) : c.data[l];
	or(d, !1);
	let f = Pf(c, u, d, t);
	Ca() && Ra(c, u, f, d), Tt(f, u);
	let h = If(f, u, f, d);
	return (
		(u[l] = h),
		io(u, h),
		YD(h, d, u),
		ma(d) && gf(c, u, d),
		s != null && mf(u, d, a),
		lr
	);
}
var Pf = kf;
function kf(t, e, r, n) {
	return ut(!0), e[H].createComment("");
}
function eC(t, e, r, n) {
	let i = e[ze],
		o = !i || ir() || Xi(i, n);
	if ((ut(o), o)) return kf(t, e, r, n);
	let s = i.data[$v]?.[n] ?? null;
	s !== null &&
		r.tView !== null &&
		r.tView.ssrId === null &&
		(r.tView.ssrId = s);
	let a = oo(i, t, e, r);
	Ji(i, n, a);
	let u = Va(i, n);
	return so(u, a);
}
function tC() {
	Pf = eC;
}
function nC(t, e, r, n, i, o) {
	let s = e.consts,
		a = Si(s, i),
		u = ro(e, t, 2, n, a);
	return (
		Df(e, r, u, Si(s, o)),
		u.attrs !== null && oa(u, u.attrs, !1),
		u.mergedAttrs !== null && oa(u, u.mergedAttrs, !0),
		e.queries !== null && e.queries.elementStart(e, u),
		u
	);
}
function pe(t, e, r, n) {
	let i = Y(),
		o = Ve(),
		s = he + t,
		a = i[H],
		u = o.firstCreatePass ? nC(s, o, i, e, r, n) : o.data[s],
		c = Lf(o, i, u, a, e, t);
	i[s] = c;
	let l = ma(u);
	return (
		or(u, !0),
		Jd(a, c, u),
		(u.flags & 32) !== 32 && Ca() && Ra(o, i, c, u),
		cm() === 0 && Tt(c, i),
		lm(),
		l && (gf(o, i, u), pf(o, u, i)),
		n !== null && mf(i, u),
		pe
	);
}
function ie() {
	let t = Ee();
	od() ? mm() : ((t = t.parent), or(t, !1));
	let e = t;
	fm(e) && pm(), dm();
	let r = Ve();
	return (
		r.firstCreatePass && (wa(r, t), Zl(t) && r.queries.elementEnd(t)),
		e.classesWithoutHost != null &&
			xm(e) &&
			Cl(r, e, Y(), e.classesWithoutHost, !0),
		e.stylesWithoutHost != null &&
			Am(e) &&
			Cl(r, e, Y(), e.stylesWithoutHost, !1),
		ie
	);
}
function yn(t, e, r, n) {
	return pe(t, e, r, n), ie(), yn;
}
var Lf = (t, e, r, n, i, o) => (ut(!0), Na(n, i, hd()));
function rC(t, e, r, n, i, o) {
	let s = e[ze],
		a = !s || ir() || Xi(s, o);
	if ((ut(a), a)) return Na(n, i, hd());
	let u = oo(s, t, e, r);
	return (
		of(s, o) && Ji(s, o, u.nextSibling),
		s && (Ld(r) || Vd(u)) && rr(r) && (hm(r), Qd(u)),
		u
	);
}
function iC() {
	Lf = rC;
}
var oC = (t, e, r, n) => (ut(!0), zd(e[H], ""));
function sC(t, e, r, n) {
	let i,
		o = e[ze],
		s = !o || ir();
	if ((ut(s), s)) return zd(e[H], "");
	let a = oo(o, t, e, r),
		u = Kv(o, n);
	return Ji(o, n, a), (i = so(u, a)), i;
}
function aC() {
	oC = sC;
}
var Bi = "en-US";
var uC = Bi;
function cC(t) {
	bg(t, "Expected localeId to be defined"),
		typeof t == "string" && (uC = t.toLowerCase().replace(/_/g, "-"));
}
function Rt(t) {
	return !!t && typeof t.then == "function";
}
function Vf(t) {
	return !!t && typeof t.subscribe == "function";
}
function dt(t, e, r, n) {
	let i = Y(),
		o = Ve(),
		s = Ee();
	return dC(o, i, i[H], s, t, e, n), dt;
}
function lC(t, e, r, n) {
	let i = t.cleanup;
	if (i != null)
		for (let o = 0; o < i.length - 1; o += 2) {
			let s = i[o];
			if (s === r && i[o + 1] === n) {
				let a = e[Gn],
					u = i[o + 2];
				return a.length > u ? a[u] : null;
			}
			typeof s == "string" && (o += 2);
		}
	return null;
}
function dC(t, e, r, n, i, o, s) {
	let a = ma(n),
		c = t.firstCreatePass && Ly(t),
		l = e[Le],
		d = ky(e),
		f = !0;
	if (n.type & 3 || s) {
		let T = we(n, e),
			b = s ? s(T) : T,
			y = d.length,
			U = s ? (V) => s(xe(V[n.index])) : n.index,
			me = null;
		if ((!s && a && (me = lC(t, e, i, n.index)), me !== null)) {
			let V = me.__ngLastListenerFn__ || me;
			(V.__ngNextListenerFn__ = o),
				(me.__ngLastListenerFn__ = o),
				(f = !1);
		} else {
			o = _l(n, e, l, o, !1);
			let V = r.listen(b, i, o);
			d.push(o, V), c && c.push(i, U, y, y + 1);
		}
	} else o = _l(n, e, l, o, !1);
	let h = n.outputs,
		g;
	if (f && h !== null && (g = h[i])) {
		let T = g.length;
		if (T)
			for (let b = 0; b < T; b += 2) {
				let y = g[b],
					U = g[b + 1],
					te = e[y][U].subscribe(o),
					be = d.length;
				d.push(o, te), c && c.push(i, n.index, be, -(be + 1));
			}
	}
}
function Ml(t, e, r, n) {
	try {
		return Re(6, e, r), r(n) !== !1;
	} catch (i) {
		return Mf(t, i), !1;
	} finally {
		Re(7, e, r);
	}
}
function _l(t, e, r, n, i) {
	return function o(s) {
		if (s === Function) return n;
		let a = t.componentOffset > -1 ? at(t.index, e) : e;
		Ba(a);
		let u = Ml(e, r, n, s),
			c = o.__ngNextListenerFn__;
		for (; c; ) (u = Ml(e, r, c, s) && u), (c = c.__ngNextListenerFn__);
		return i && u === !1 && s.preventDefault(), u;
	};
}
function Za(t = 1) {
	return bm(t);
}
function Dn(t, e = "") {
	let r = Y(),
		n = Ve(),
		i = t + he,
		o = n.firstCreatePass ? ro(n, i, 1, e, null) : n.data[i],
		s = jf(n, r, o, e, t);
	(r[i] = s), Ca() && Ra(n, r, s, o), or(o, !1);
}
var jf = (t, e, r, n, i) => (ut(!0), Hd(e[H], n));
function fC(t, e, r, n, i) {
	let o = e[ze],
		s = !o || ir() || Xi(o, i);
	return ut(s), s ? Hd(e[H], n) : oo(o, t, e, r);
}
function hC() {
	jf = fC;
}
function ao(t) {
	return uo("", t, ""), ao;
}
function uo(t, e, r) {
	let n = Y(),
		i = mD(n, t, e, r);
	return i !== hn && Vy(n, dn(), i), uo;
}
function pC(t, e, r) {
	let n = Ve();
	if (n.firstCreatePass) {
		let i = ot(t);
		la(r, n.data, n.blueprint, i, !0), la(e, n.data, n.blueprint, i, !1);
	}
}
function la(t, e, r, n, i) {
	if (((t = J(t)), Array.isArray(t)))
		for (let o = 0; o < t.length; o++) la(t[o], e, r, n, i);
	else {
		let o = Ve(),
			s = Y(),
			a = Ee(),
			u = sn(t) ? t : J(t.provide),
			c = Rd(t),
			l = a.providerIndexes & 1048575,
			d = a.directiveStart,
			f = a.providerIndexes >> 20;
		if (sn(t) || !t.multi) {
			let h = new _t(c, i, L),
				g = _s(u, e, i ? l : l + f, d);
			g === -1
				? (ks(Ai(a, s), o, u),
					Ms(o, t, e.length),
					e.push(u),
					a.directiveStart++,
					a.directiveEnd++,
					i && (a.providerIndexes += 1048576),
					r.push(h),
					s.push(h))
				: ((r[g] = h), (s[g] = h));
		} else {
			let h = _s(u, e, l + f, d),
				g = _s(u, e, l, l + f),
				T = h >= 0 && r[h],
				b = g >= 0 && r[g];
			if ((i && !b) || (!i && !T)) {
				ks(Ai(a, s), o, u);
				let y = vC(i ? mC : gC, r.length, i, n, c);
				!i && b && (r[g].providerFactory = y),
					Ms(o, t, e.length, 0),
					e.push(u),
					a.directiveStart++,
					a.directiveEnd++,
					i && (a.providerIndexes += 1048576),
					r.push(y),
					s.push(y);
			} else {
				let y = $f(r[i ? g : h], c, !i && n);
				Ms(o, t, h > -1 ? h : g, y);
			}
			!i && n && b && r[g].componentProviders++;
		}
	}
}
function Ms(t, e, r, n) {
	let i = sn(e),
		o = Qm(e);
	if (i || o) {
		let u = (o ? J(e.useClass) : e).prototype.ngOnDestroy;
		if (u) {
			let c = t.destroyHooks || (t.destroyHooks = []);
			if (!i && e.multi) {
				let l = c.indexOf(r);
				l === -1 ? c.push(r, [n, u]) : c[l + 1].push(n, u);
			} else c.push(r, u);
		}
	}
}
function $f(t, e, r) {
	return r && t.componentProviders++, t.multi.push(e) - 1;
}
function _s(t, e, r, n) {
	for (let i = r; i < n; i++) if (e[i] === t) return i;
	return -1;
}
function gC(t, e, r, n) {
	return da(this.multi, []);
}
function mC(t, e, r, n) {
	let i = this.multi,
		o;
	if (this.providerFactory) {
		let s = this.providerFactory.componentProviders,
			a = on(r, r[A], this.providerFactory.index, n);
		(o = a.slice(0, s)), da(i, o);
		for (let u = s; u < a.length; u++) o.push(a[u]);
	} else (o = []), da(i, o);
	return o;
}
function da(t, e) {
	for (let r = 0; r < t.length; r++) {
		let n = t[r];
		e.push(n());
	}
	return e;
}
function vC(t, e, r, n, i) {
	let o = new _t(t, r, L);
	return (
		(o.multi = []),
		(o.index = e),
		(o.componentProviders = 0),
		$f(o, i, n && !r),
		o
	);
}
function Ya(t, e = []) {
	return (r) => {
		r.providersResolver = (n, i) => pC(n, i ? i(t) : t, e);
	};
}
var st = class {},
	er = class {};
var fa = class extends st {
		constructor(e, r, n) {
			super(),
				(this._parent = r),
				(this._bootstrapComponents = []),
				(this.destroyCbs = []),
				(this.componentFactoryResolver = new ji(this));
			let i = Hl(e);
			(this._bootstrapComponents = kd(i.bootstrap)),
				(this._r3Injector = Fd(
					e,
					r,
					[
						{ provide: st, useValue: this },
						{
							provide: eo,
							useValue: this.componentFactoryResolver,
						},
						...n,
					],
					K(e),
					new Set(["environment"]),
				)),
				this._r3Injector.resolveInjectorInitializers(),
				(this.instance = this._r3Injector.get(e));
		}
		get injector() {
			return this._r3Injector;
		}
		destroy() {
			let e = this._r3Injector;
			!e.destroyed && e.destroy(),
				this.destroyCbs.forEach((r) => r()),
				(this.destroyCbs = null);
		}
		onDestroy(e) {
			this.destroyCbs.push(e);
		}
	},
	ha = class extends er {
		constructor(e) {
			super(), (this.moduleType = e);
		}
		create(e) {
			return new fa(this.moduleType, e, []);
		}
	};
var Hi = class extends st {
	constructor(e) {
		super(),
			(this.componentFactoryResolver = new ji(this)),
			(this.instance = null);
		let r = new Qn(
			[
				...e.providers,
				{ provide: st, useValue: this },
				{ provide: eo, useValue: this.componentFactoryResolver },
			],
			e.parent || _a(),
			e.debugName,
			new Set(["environment"]),
		);
		(this.injector = r),
			e.runEnvironmentInitializers && r.resolveInjectorInitializers();
	}
	destroy() {
		this.injector.destroy();
	}
	onDestroy(e) {
		this.injector.onDestroy(e);
	}
};
function Qa(t, e, r = null) {
	return new Hi({
		providers: t,
		parent: e,
		debugName: r,
		runEnvironmentInitializers: !0,
	}).injector;
}
var yC = (() => {
	let e = class e {
		constructor(n) {
			(this._injector = n), (this.cachedInjectors = new Map());
		}
		getOrCreateStandaloneInjector(n) {
			if (!n.standalone) return null;
			if (!this.cachedInjectors.has(n)) {
				let i = Ad(!1, n.type),
					o =
						i.length > 0
							? Qa(
									[i],
									this._injector,
									`Standalone[${n.type.name}]`,
								)
							: null;
				this.cachedInjectors.set(n, o);
			}
			return this.cachedInjectors.get(n);
		}
		ngOnDestroy() {
			try {
				for (let n of this.cachedInjectors.values())
					n !== null && n.destroy();
			} finally {
				this.cachedInjectors.clear();
			}
		}
	};
	e.ɵprov = v({
		token: e,
		providedIn: "environment",
		factory: () => new e(D(re)),
	});
	let t = e;
	return t;
})();
function Cn(t) {
	cr("NgStandalone"),
		(t.getStandaloneInjector = (e) =>
			e.get(yC).getOrCreateStandaloneInjector(t));
}
var co = (() => {
		let e = class e {};
		e.__NG_ELEMENT_ID__ = wC;
		let t = e;
		return t;
	})(),
	DC = co,
	CC = class extends DC {
		constructor(e, r, n) {
			super(),
				(this._declarationLView = e),
				(this._declarationTContainer = r),
				(this.elementRef = n);
		}
		get ssrId() {
			return this._declarationTContainer.tView?.ssrId || null;
		}
		createEmbeddedView(e, r) {
			return this.createEmbeddedViewImpl(e, r);
		}
		createEmbeddedViewImpl(e, r, n) {
			let i = HD(this._declarationLView, this._declarationTContainer, e, {
				injector: r,
				dehydratedView: n,
			});
			return new xt(i);
		}
	};
function wC() {
	return EC(Ee(), Y());
}
function EC(t, e) {
	return t.type & 4 ? new CC(e, t, to(t, e)) : null;
}
var lo = (() => {
		let e = class e {
			log(n) {
				console.log(n);
			}
			warn(n) {
				console.warn(n);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({
				token: e,
				factory: e.ɵfac,
				providedIn: "platform",
			}));
		let t = e;
		return t;
	})(),
	pa = class {
		constructor(e, r) {
			(this.ngModuleFactory = e), (this.componentFactories = r);
		}
	},
	Ka = (() => {
		let e = class e {
			compileModuleSync(n) {
				return new ha(n);
			}
			compileModuleAsync(n) {
				return Promise.resolve(this.compileModuleSync(n));
			}
			compileModuleAndAllComponentsSync(n) {
				let i = this.compileModuleSync(n),
					o = Hl(n),
					s = kd(o.declarations).reduce((a, u) => {
						let c = It(u);
						return c && a.push(new Jn(c)), a;
					}, []);
				return new pa(i, s);
			}
			compileModuleAndAllComponentsAsync(n) {
				return Promise.resolve(
					this.compileModuleAndAllComponentsSync(n),
				);
			}
			clearCache() {}
			clearCacheFor(n) {}
			getModuleId(n) {}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})();
var wn = (() => {
	let e = class e {
		constructor() {
			(this.taskId = 0),
				(this.pendingTasks = new Set()),
				(this.hasPendingTasks = new Q(!1));
		}
		get _hasPendingTasks() {
			return this.hasPendingTasks.value;
		}
		add() {
			this._hasPendingTasks || this.hasPendingTasks.next(!0);
			let n = this.taskId++;
			return this.pendingTasks.add(n), n;
		}
		remove(n) {
			this.pendingTasks.delete(n),
				this.pendingTasks.size === 0 &&
					this._hasPendingTasks &&
					this.hasPendingTasks.next(!1);
		}
		ngOnDestroy() {
			this.pendingTasks.clear(),
				this._hasPendingTasks && this.hasPendingTasks.next(!1);
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
	let t = e;
	return t;
})();
var Uf = new w("");
var Bf = new w("Application Initializer"),
	Hf = (() => {
		let e = class e {
			constructor() {
				(this.initialized = !1),
					(this.done = !1),
					(this.donePromise = new Promise((n, i) => {
						(this.resolve = n), (this.reject = i);
					})),
					(this.appInits = p(Bf, { optional: !0 }) ?? []);
			}
			runInitializers() {
				if (this.initialized) return;
				let n = [];
				for (let o of this.appInits) {
					let s = o();
					if (Rt(s)) n.push(s);
					else if (Vf(s)) {
						let a = new Promise((u, c) => {
							s.subscribe({ complete: u, error: c });
						});
						n.push(a);
					}
				}
				let i = () => {
					(this.done = !0), this.resolve();
				};
				Promise.all(n)
					.then(() => {
						i();
					})
					.catch((o) => {
						this.reject(o);
					}),
					n.length === 0 && i(),
					(this.initialized = !0);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})(),
	En = new w("appBootstrapListener");
function IC() {
	Dc(() => {
		throw new C(600, !1);
	});
}
function bC(t) {
	return t.isBoundToModule;
}
function MC(t, e, r) {
	try {
		let n = r();
		return Rt(n)
			? n.catch((i) => {
					throw (e.runOutsideAngular(() => t.handleError(i)), i);
				})
			: n;
	} catch (n) {
		throw (e.runOutsideAngular(() => t.handleError(n)), n);
	}
}
var ft = (() => {
	let e = class e {
		constructor() {
			(this._bootstrapListeners = []),
				(this._runningTick = !1),
				(this._destroyed = !1),
				(this._destroyListeners = []),
				(this._views = []),
				(this.internalErrorHandler = p(uf)),
				(this.componentTypes = []),
				(this.components = []),
				(this.isStable = p(wn).hasPendingTasks.pipe(E((n) => !n))),
				(this._injector = p(re));
		}
		get destroyed() {
			return this._destroyed;
		}
		get injector() {
			return this._injector;
		}
		bootstrap(n, i) {
			let o = n instanceof ki;
			if (!this._injector.get(Hf).done) {
				let g =
					"Cannot bootstrap as there are still asynchronous initializers running." +
					(!o && Bl(n)
						? ""
						: " Bootstrap components in the `ngDoBootstrap` method of the root module.");
				throw new C(405, !1);
			}
			let a;
			o
				? (a = n)
				: (a = this._injector.get(eo).resolveComponentFactory(n)),
				this.componentTypes.push(a.componentType);
			let u = bC(a) ? void 0 : this._injector.get(st),
				c = i || a.selector,
				l = a.create(Ke.NULL, [], c, u),
				d = l.location.nativeElement,
				f = l.injector.get(Uf, null);
			return (
				f?.registerApplication(d),
				l.onDestroy(() => {
					this.detachView(l.hostView),
						Ss(this.components, l),
						f?.unregisterApplication(d);
				}),
				this._loadComponent(l),
				l
			);
		}
		tick() {
			if (this._runningTick) throw new C(101, !1);
			try {
				this._runningTick = !0;
				for (let n of this._views) n.detectChanges();
			} catch (n) {
				this.internalErrorHandler(n);
			} finally {
				this._runningTick = !1;
			}
		}
		attachView(n) {
			let i = n;
			this._views.push(i), i.attachToAppRef(this);
		}
		detachView(n) {
			let i = n;
			Ss(this._views, i), i.detachFromAppRef();
		}
		_loadComponent(n) {
			this.attachView(n.hostView), this.tick(), this.components.push(n);
			let i = this._injector.get(En, []);
			[...this._bootstrapListeners, ...i].forEach((o) => o(n));
		}
		ngOnDestroy() {
			if (!this._destroyed)
				try {
					this._destroyListeners.forEach((n) => n()),
						this._views.slice().forEach((n) => n.destroy());
				} finally {
					(this._destroyed = !0),
						(this._views = []),
						(this._bootstrapListeners = []),
						(this._destroyListeners = []);
				}
		}
		onDestroy(n) {
			return (
				this._destroyListeners.push(n),
				() => Ss(this._destroyListeners, n)
			);
		}
		destroy() {
			if (this._destroyed) throw new C(406, !1);
			let n = this._injector;
			n.destroy && !n.destroyed && n.destroy();
		}
		get viewCount() {
			return this._views.length;
		}
		warnIfDestroyed() {}
	};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
	let t = e;
	return t;
})();
function Ss(t, e) {
	let r = t.indexOf(e);
	r > -1 && t.splice(r, 1);
}
var vi;
function Ja(t) {
	vi ??= new WeakMap();
	let e = vi.get(t);
	if (e) return e;
	let r = t.isStable
		.pipe(_e((n) => n))
		.toPromise()
		.then(() => {});
	return vi.set(t, r), t.onDestroy(() => vi?.delete(t)), r;
}
var _C = (() => {
	let e = class e {
		constructor() {
			(this.zone = p(B)), (this.applicationRef = p(ft));
		}
		initialize() {
			this._onMicrotaskEmptySubscription ||
				(this._onMicrotaskEmptySubscription =
					this.zone.onMicrotaskEmpty.subscribe({
						next: () => {
							this.zone.run(() => {
								this.applicationRef.tick();
							});
						},
					}));
		}
		ngOnDestroy() {
			this._onMicrotaskEmptySubscription?.unsubscribe();
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
	let t = e;
	return t;
})();
function SC(t) {
	return [
		{ provide: B, useFactory: t },
		{
			provide: St,
			multi: !0,
			useFactory: () => {
				let e = p(_C, { optional: !0 });
				return () => e.initialize();
			},
		},
		{
			provide: St,
			multi: !0,
			useFactory: () => {
				let e = p(NC);
				return () => {
					e.initialize();
				};
			},
		},
		{ provide: uf, useFactory: TC },
	];
}
function TC() {
	let t = p(B),
		e = p(qe);
	return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function xC(t) {
	let e = SC(() => new B(AC(t)));
	return ct([[], e]);
}
function AC(t) {
	return {
		enableLongStackTrace: !1,
		shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
		shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
	};
}
var NC = (() => {
	let e = class e {
		constructor() {
			(this.subscription = new q()),
				(this.initialized = !1),
				(this.zone = p(B)),
				(this.pendingTasks = p(wn));
		}
		initialize() {
			if (this.initialized) return;
			this.initialized = !0;
			let n = null;
			!this.zone.isStable &&
				!this.zone.hasPendingMacrotasks &&
				!this.zone.hasPendingMicrotasks &&
				(n = this.pendingTasks.add()),
				this.zone.runOutsideAngular(() => {
					this.subscription.add(
						this.zone.onStable.subscribe(() => {
							B.assertNotInAngularZone(),
								queueMicrotask(() => {
									n !== null &&
										!this.zone.hasPendingMacrotasks &&
										!this.zone.hasPendingMicrotasks &&
										(this.pendingTasks.remove(n),
										(n = null));
								});
						}),
					);
				}),
				this.subscription.add(
					this.zone.onUnstable.subscribe(() => {
						B.assertInAngularZone(),
							(n ??= this.pendingTasks.add());
					}),
				);
		}
		ngOnDestroy() {
			this.subscription.unsubscribe();
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
	let t = e;
	return t;
})();
function OC() {
	return (typeof $localize < "u" && $localize.locale) || Bi;
}
var Xa = new w("LocaleId", {
	providedIn: "root",
	factory: () => p(Xa, x.Optional | x.SkipSelf) || OC(),
});
var zf = new w("PlatformDestroyListeners");
var Ei = null;
function RC(t = [], e) {
	return Ke.create({
		name: e,
		providers: [
			{ provide: Yi, useValue: "platform" },
			{ provide: zf, useValue: new Set([() => (Ei = null)]) },
			...t,
		],
	});
}
function FC(t = []) {
	if (Ei) return Ei;
	let e = RC(t);
	return (Ei = e), IC(), PC(e), e;
}
function PC(t) {
	t.get(Sa, null)?.forEach((r) => r());
}
function Gf(t) {
	try {
		let { rootComponent: e, appProviders: r, platformProviders: n } = t,
			i = FC(n),
			o = [xC(), ...(r || [])],
			a = new Hi({
				providers: o,
				parent: i,
				debugName: "",
				runEnvironmentInitializers: !1,
			}).injector,
			u = a.get(B);
		return u.run(() => {
			a.resolveInjectorInitializers();
			let c = a.get(qe, null),
				l;
			u.runOutsideAngular(() => {
				l = u.onError.subscribe({
					next: (h) => {
						c.handleError(h);
					},
				});
			});
			let d = () => a.destroy(),
				f = i.get(zf);
			return (
				f.add(d),
				a.onDestroy(() => {
					l.unsubscribe(), f.delete(d);
				}),
				MC(c, u, () => {
					let h = a.get(Hf);
					return (
						h.runInitializers(),
						h.donePromise.then(() => {
							let g = a.get(Xa, Bi);
							cC(g || Bi);
							let T = a.get(ft);
							return e !== void 0 && T.bootstrap(e), T;
						})
					);
				})
			);
		});
	} catch (e) {
		return Promise.reject(e);
	}
}
var Sl = !1;
function kC() {
	Sl || ((Sl = !0), qv(), iC(), hC(), aC(), tC(), JD(), BD(), yy());
}
function LC(t, e) {
	return Ja(t);
}
function Wf() {
	return ct([
		{
			provide: pi,
			useFactory: () => {
				let t = !0;
				return (
					hi() && (t = !!p(Nt, { optional: !0 })?.get(nf, null)),
					t && cr("NgHydration"),
					t
				);
			},
		},
		{
			provide: St,
			useValue: () => {
				hi() && p(pi) && (VC(), kC());
			},
			multi: !0,
		},
		{ provide: lf, useFactory: () => hi() && p(pi) },
		{
			provide: En,
			useFactory: () => {
				if (hi() && p(pi)) {
					let t = p(ft),
						e = p(Ke);
					return () => {
						LC(t, e).then(() => {
							B.assertInAngularZone(), FD(t);
						});
					};
				}
				return () => {};
			},
			multi: !0,
		},
	]);
}
function VC() {
	let t = Qi(),
		e;
	for (let r of t.body.childNodes)
		if (r.nodeType === Node.COMMENT_NODE && r.textContent?.trim() === Gv) {
			e = r;
			break;
		}
	if (!e) throw new C(-507, !1);
}
function fo(t) {
	return typeof t == "boolean" ? t : t != null && t !== "false";
}
var eu = null;
function Je() {
	return eu;
}
function Kf(t) {
	eu || (eu = t);
}
var ho = class {},
	ee = new w("DocumentToken"),
	Jf = (() => {
		let e = class e {
			historyGo(n) {
				throw new Error("Not implemented");
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({
				token: e,
				factory: () => (() => p(UC))(),
				providedIn: "platform",
			}));
		let t = e;
		return t;
	})();
var UC = (() => {
	let e = class e extends Jf {
		constructor() {
			super(),
				(this._doc = p(ee)),
				(this._location = window.location),
				(this._history = window.history);
		}
		getBaseHrefFromDOM() {
			return Je().getBaseHref(this._doc);
		}
		onPopState(n) {
			let i = Je().getGlobalEventTarget(this._doc, "window");
			return (
				i.addEventListener("popstate", n, !1),
				() => i.removeEventListener("popstate", n)
			);
		}
		onHashChange(n) {
			let i = Je().getGlobalEventTarget(this._doc, "window");
			return (
				i.addEventListener("hashchange", n, !1),
				() => i.removeEventListener("hashchange", n)
			);
		}
		get href() {
			return this._location.href;
		}
		get protocol() {
			return this._location.protocol;
		}
		get hostname() {
			return this._location.hostname;
		}
		get port() {
			return this._location.port;
		}
		get pathname() {
			return this._location.pathname;
		}
		get search() {
			return this._location.search;
		}
		get hash() {
			return this._location.hash;
		}
		set pathname(n) {
			this._location.pathname = n;
		}
		pushState(n, i, o) {
			this._history.pushState(n, i, o);
		}
		replaceState(n, i, o) {
			this._history.replaceState(n, i, o);
		}
		forward() {
			this._history.forward();
		}
		back() {
			this._history.back();
		}
		historyGo(n = 0) {
			this._history.go(n);
		}
		getState() {
			return this._history.state;
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵprov = v({
			token: e,
			factory: () => (() => new e())(),
			providedIn: "platform",
		}));
	let t = e;
	return t;
})();
function Xf(t, e) {
	if (t.length == 0) return e;
	if (e.length == 0) return t;
	let r = 0;
	return (
		t.endsWith("/") && r++,
		e.startsWith("/") && r++,
		r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
	);
}
function qf(t) {
	let e = t.match(/#|\?|$/),
		r = (e && e.index) || t.length,
		n = r - (t[r - 1] === "/" ? 1 : 0);
	return t.slice(0, n) + t.slice(r);
}
function Ft(t) {
	return t && t[0] !== "?" ? "?" + t : t;
}
var po = (() => {
		let e = class e {
			historyGo(n) {
				throw new Error("Not implemented");
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({
				token: e,
				factory: () => (() => p(eh))(),
				providedIn: "root",
			}));
		let t = e;
		return t;
	})(),
	BC = new w("appBaseHref"),
	eh = (() => {
		let e = class e extends po {
			constructor(n, i) {
				super(),
					(this._platformLocation = n),
					(this._removeListenerFns = []),
					(this._baseHref =
						i ??
						this._platformLocation.getBaseHrefFromDOM() ??
						p(ee).location?.origin ??
						"");
			}
			ngOnDestroy() {
				for (; this._removeListenerFns.length; )
					this._removeListenerFns.pop()();
			}
			onPopState(n) {
				this._removeListenerFns.push(
					this._platformLocation.onPopState(n),
					this._platformLocation.onHashChange(n),
				);
			}
			getBaseHref() {
				return this._baseHref;
			}
			prepareExternalUrl(n) {
				return Xf(this._baseHref, n);
			}
			path(n = !1) {
				let i =
						this._platformLocation.pathname +
						Ft(this._platformLocation.search),
					o = this._platformLocation.hash;
				return o && n ? `${i}${o}` : i;
			}
			pushState(n, i, o, s) {
				let a = this.prepareExternalUrl(o + Ft(s));
				this._platformLocation.pushState(n, i, a);
			}
			replaceState(n, i, o, s) {
				let a = this.prepareExternalUrl(o + Ft(s));
				this._platformLocation.replaceState(n, i, a);
			}
			forward() {
				this._platformLocation.forward();
			}
			back() {
				this._platformLocation.back();
			}
			getState() {
				return this._platformLocation.getState();
			}
			historyGo(n = 0) {
				this._platformLocation.historyGo?.(n);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(D(Jf), D(BC, 8));
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})();
var dr = (() => {
	let e = class e {
		constructor(n) {
			(this._subject = new X()),
				(this._urlChangeListeners = []),
				(this._urlChangeSubscription = null),
				(this._locationStrategy = n);
			let i = this._locationStrategy.getBaseHref();
			(this._basePath = GC(qf(Zf(i)))),
				this._locationStrategy.onPopState((o) => {
					this._subject.emit({
						url: this.path(!0),
						pop: !0,
						state: o.state,
						type: o.type,
					});
				});
		}
		ngOnDestroy() {
			this._urlChangeSubscription?.unsubscribe(),
				(this._urlChangeListeners = []);
		}
		path(n = !1) {
			return this.normalize(this._locationStrategy.path(n));
		}
		getState() {
			return this._locationStrategy.getState();
		}
		isCurrentPathEqualTo(n, i = "") {
			return this.path() == this.normalize(n + Ft(i));
		}
		normalize(n) {
			return e.stripTrailingSlash(zC(this._basePath, Zf(n)));
		}
		prepareExternalUrl(n) {
			return (
				n && n[0] !== "/" && (n = "/" + n),
				this._locationStrategy.prepareExternalUrl(n)
			);
		}
		go(n, i = "", o = null) {
			this._locationStrategy.pushState(o, "", n, i),
				this._notifyUrlChangeListeners(
					this.prepareExternalUrl(n + Ft(i)),
					o,
				);
		}
		replaceState(n, i = "", o = null) {
			this._locationStrategy.replaceState(o, "", n, i),
				this._notifyUrlChangeListeners(
					this.prepareExternalUrl(n + Ft(i)),
					o,
				);
		}
		forward() {
			this._locationStrategy.forward();
		}
		back() {
			this._locationStrategy.back();
		}
		historyGo(n = 0) {
			this._locationStrategy.historyGo?.(n);
		}
		onUrlChange(n) {
			return (
				this._urlChangeListeners.push(n),
				this._urlChangeSubscription ||
					(this._urlChangeSubscription = this.subscribe((i) => {
						this._notifyUrlChangeListeners(i.url, i.state);
					})),
				() => {
					let i = this._urlChangeListeners.indexOf(n);
					this._urlChangeListeners.splice(i, 1),
						this._urlChangeListeners.length === 0 &&
							(this._urlChangeSubscription?.unsubscribe(),
							(this._urlChangeSubscription = null));
				}
			);
		}
		_notifyUrlChangeListeners(n = "", i) {
			this._urlChangeListeners.forEach((o) => o(n, i));
		}
		subscribe(n, i, o) {
			return this._subject.subscribe({ next: n, error: i, complete: o });
		}
	};
	(e.normalizeQueryParams = Ft),
		(e.joinWithSlash = Xf),
		(e.stripTrailingSlash = qf),
		(e.ɵfac = function (i) {
			return new (i || e)(D(po));
		}),
		(e.ɵprov = v({ token: e, factory: () => HC(), providedIn: "root" }));
	let t = e;
	return t;
})();
function HC() {
	return new dr(D(po));
}
function zC(t, e) {
	if (!t || !e.startsWith(t)) return e;
	let r = e.substring(t.length);
	return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function Zf(t) {
	return t.replace(/\/index.html$/, "");
}
function GC(t) {
	if (new RegExp("^(https?:)?//").test(t)) {
		let [, r] = t.split(/\/\/[^\/]+/);
		return r;
	}
	return t;
}
function go(t, e) {
	e = encodeURIComponent(e);
	for (let r of t.split(";")) {
		let n = r.indexOf("="),
			[i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
		if (i.trim() === e) return decodeURIComponent(o);
	}
	return null;
}
var tu = class {
		constructor(e, r, n, i) {
			(this.$implicit = e),
				(this.ngForOf = r),
				(this.index = n),
				(this.count = i);
		}
		get first() {
			return this.index === 0;
		}
		get last() {
			return this.index === this.count - 1;
		}
		get even() {
			return this.index % 2 === 0;
		}
		get odd() {
			return !this.even;
		}
	},
	th = (() => {
		let e = class e {
			set ngForOf(n) {
				(this._ngForOf = n), (this._ngForOfDirty = !0);
			}
			set ngForTrackBy(n) {
				this._trackByFn = n;
			}
			get ngForTrackBy() {
				return this._trackByFn;
			}
			constructor(n, i, o) {
				(this._viewContainer = n),
					(this._template = i),
					(this._differs = o),
					(this._ngForOf = null),
					(this._ngForOfDirty = !0),
					(this._differ = null);
			}
			set ngForTemplate(n) {
				n && (this._template = n);
			}
			ngDoCheck() {
				if (this._ngForOfDirty) {
					this._ngForOfDirty = !1;
					let n = this._ngForOf;
					if (!this._differ && n)
						if (!1)
							try {
							} catch {}
						else
							this._differ = this._differs
								.find(n)
								.create(this.ngForTrackBy);
				}
				if (this._differ) {
					let n = this._differ.diff(this._ngForOf);
					n && this._applyChanges(n);
				}
			}
			_applyChanges(n) {
				let i = this._viewContainer;
				n.forEachOperation((o, s, a) => {
					if (o.previousIndex == null)
						i.createEmbeddedView(
							this._template,
							new tu(o.item, this._ngForOf, -1, -1),
							a === null ? void 0 : a,
						);
					else if (a == null) i.remove(s === null ? void 0 : s);
					else if (s !== null) {
						let u = i.get(s);
						i.move(u, a), Yf(u, o);
					}
				});
				for (let o = 0, s = i.length; o < s; o++) {
					let u = i.get(o).context;
					(u.index = o), (u.count = s), (u.ngForOf = this._ngForOf);
				}
				n.forEachIdentityChange((o) => {
					let s = i.get(o.currentIndex);
					Yf(s, o);
				});
			}
			static ngTemplateContextGuard(n, i) {
				return !0;
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(L(vn), L(co), L(ja));
		}),
			(e.ɵdir = Ae({
				type: e,
				selectors: [["", "ngFor", "", "ngForOf", ""]],
				inputs: {
					ngForOf: "ngForOf",
					ngForTrackBy: "ngForTrackBy",
					ngForTemplate: "ngForTemplate",
				},
				standalone: !0,
			}));
		let t = e;
		return t;
	})();
function Yf(t, e) {
	t.context.$implicit = e.item;
}
var nh = (() => {
		let e = class e {
			constructor(n, i) {
				(this._viewContainer = n),
					(this._context = new nu()),
					(this._thenTemplateRef = null),
					(this._elseTemplateRef = null),
					(this._thenViewRef = null),
					(this._elseViewRef = null),
					(this._thenTemplateRef = i);
			}
			set ngIf(n) {
				(this._context.$implicit = this._context.ngIf = n),
					this._updateView();
			}
			set ngIfThen(n) {
				Qf("ngIfThen", n),
					(this._thenTemplateRef = n),
					(this._thenViewRef = null),
					this._updateView();
			}
			set ngIfElse(n) {
				Qf("ngIfElse", n),
					(this._elseTemplateRef = n),
					(this._elseViewRef = null),
					this._updateView();
			}
			_updateView() {
				this._context.$implicit
					? this._thenViewRef ||
						(this._viewContainer.clear(),
						(this._elseViewRef = null),
						this._thenTemplateRef &&
							(this._thenViewRef =
								this._viewContainer.createEmbeddedView(
									this._thenTemplateRef,
									this._context,
								)))
					: this._elseViewRef ||
						(this._viewContainer.clear(),
						(this._thenViewRef = null),
						this._elseTemplateRef &&
							(this._elseViewRef =
								this._viewContainer.createEmbeddedView(
									this._elseTemplateRef,
									this._context,
								)));
			}
			static ngTemplateContextGuard(n, i) {
				return !0;
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(L(vn), L(co));
		}),
			(e.ɵdir = Ae({
				type: e,
				selectors: [["", "ngIf", ""]],
				inputs: {
					ngIf: "ngIf",
					ngIfThen: "ngIfThen",
					ngIfElse: "ngIfElse",
				},
				standalone: !0,
			}));
		let t = e;
		return t;
	})(),
	nu = class {
		constructor() {
			(this.$implicit = null), (this.ngIf = null);
		}
	};
function Qf(t, e) {
	if (!!!(!e || e.createEmbeddedView))
		throw new Error(`${t} must be a TemplateRef, but received '${K(e)}'.`);
}
var fr = (() => {
		let e = class e {};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵmod = Ye({ type: e })),
			(e.ɵinj = Ze({}));
		let t = e;
		return t;
	})(),
	rh = "browser",
	WC = "server";
function iu(t) {
	return t === WC;
}
var In = class {};
var pr = class {},
	yo = class {},
	pt = class t {
		constructor(e) {
			(this.normalizedNames = new Map()),
				(this.lazyUpdate = null),
				e
					? typeof e == "string"
						? (this.lazyInit = () => {
								(this.headers = new Map()),
									e
										.split(
											`
`,
										)
										.forEach((r) => {
											let n = r.indexOf(":");
											if (n > 0) {
												let i = r.slice(0, n),
													o = i.toLowerCase(),
													s = r.slice(n + 1).trim();
												this.maybeSetNormalizedName(
													i,
													o,
												),
													this.headers.has(o)
														? this.headers
																.get(o)
																.push(s)
														: this.headers.set(o, [
																s,
															]);
											}
										});
							})
						: typeof Headers < "u" && e instanceof Headers
							? ((this.headers = new Map()),
								e.forEach((r, n) => {
									this.setHeaderEntries(n, r);
								}))
							: (this.lazyInit = () => {
									(this.headers = new Map()),
										Object.entries(e).forEach(([r, n]) => {
											this.setHeaderEntries(r, n);
										});
								})
					: (this.headers = new Map());
		}
		has(e) {
			return this.init(), this.headers.has(e.toLowerCase());
		}
		get(e) {
			this.init();
			let r = this.headers.get(e.toLowerCase());
			return r && r.length > 0 ? r[0] : null;
		}
		keys() {
			return this.init(), Array.from(this.normalizedNames.values());
		}
		getAll(e) {
			return this.init(), this.headers.get(e.toLowerCase()) || null;
		}
		append(e, r) {
			return this.clone({ name: e, value: r, op: "a" });
		}
		set(e, r) {
			return this.clone({ name: e, value: r, op: "s" });
		}
		delete(e, r) {
			return this.clone({ name: e, value: r, op: "d" });
		}
		maybeSetNormalizedName(e, r) {
			this.normalizedNames.has(r) || this.normalizedNames.set(r, e);
		}
		init() {
			this.lazyInit &&
				(this.lazyInit instanceof t
					? this.copyFrom(this.lazyInit)
					: this.lazyInit(),
				(this.lazyInit = null),
				this.lazyUpdate &&
					(this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
					(this.lazyUpdate = null)));
		}
		copyFrom(e) {
			e.init(),
				Array.from(e.headers.keys()).forEach((r) => {
					this.headers.set(r, e.headers.get(r)),
						this.normalizedNames.set(r, e.normalizedNames.get(r));
				});
		}
		clone(e) {
			let r = new t();
			return (
				(r.lazyInit =
					this.lazyInit && this.lazyInit instanceof t
						? this.lazyInit
						: this),
				(r.lazyUpdate = (this.lazyUpdate || []).concat([e])),
				r
			);
		}
		applyUpdate(e) {
			let r = e.name.toLowerCase();
			switch (e.op) {
				case "a":
				case "s":
					let n = e.value;
					if ((typeof n == "string" && (n = [n]), n.length === 0))
						return;
					this.maybeSetNormalizedName(e.name, r);
					let i = (e.op === "a" ? this.headers.get(r) : void 0) || [];
					i.push(...n), this.headers.set(r, i);
					break;
				case "d":
					let o = e.value;
					if (!o)
						this.headers.delete(r), this.normalizedNames.delete(r);
					else {
						let s = this.headers.get(r);
						if (!s) return;
						(s = s.filter((a) => o.indexOf(a) === -1)),
							s.length === 0
								? (this.headers.delete(r),
									this.normalizedNames.delete(r))
								: this.headers.set(r, s);
					}
					break;
			}
		}
		setHeaderEntries(e, r) {
			let n = (Array.isArray(r) ? r : [r]).map((o) => o.toString()),
				i = e.toLowerCase();
			this.headers.set(i, n), this.maybeSetNormalizedName(e, i);
		}
		forEach(e) {
			this.init(),
				Array.from(this.normalizedNames.keys()).forEach((r) =>
					e(this.normalizedNames.get(r), this.headers.get(r)),
				);
		}
	};
var su = class {
	encodeKey(e) {
		return oh(e);
	}
	encodeValue(e) {
		return oh(e);
	}
	decodeKey(e) {
		return decodeURIComponent(e);
	}
	decodeValue(e) {
		return decodeURIComponent(e);
	}
};
function ZC(t, e) {
	let r = new Map();
	return (
		t.length > 0 &&
			t
				.replace(/^\?/, "")
				.split("&")
				.forEach((i) => {
					let o = i.indexOf("="),
						[s, a] =
							o == -1
								? [e.decodeKey(i), ""]
								: [
										e.decodeKey(i.slice(0, o)),
										e.decodeValue(i.slice(o + 1)),
									],
						u = r.get(s) || [];
					u.push(a), r.set(s, u);
				}),
		r
	);
}
var YC = /%(\d[a-f0-9])/gi,
	QC = {
		40: "@",
		"3A": ":",
		24: "$",
		"2C": ",",
		"3B": ";",
		"3D": "=",
		"3F": "?",
		"2F": "/",
	};
function oh(t) {
	return encodeURIComponent(t).replace(YC, (e, r) => QC[r] ?? e);
}
function mo(t) {
	return `${t}`;
}
var ht = class t {
	constructor(e = {}) {
		if (
			((this.updates = null),
			(this.cloneFrom = null),
			(this.encoder = e.encoder || new su()),
			e.fromString)
		) {
			if (e.fromObject)
				throw new Error(
					"Cannot specify both fromString and fromObject.",
				);
			this.map = ZC(e.fromString, this.encoder);
		} else
			e.fromObject
				? ((this.map = new Map()),
					Object.keys(e.fromObject).forEach((r) => {
						let n = e.fromObject[r],
							i = Array.isArray(n) ? n.map(mo) : [mo(n)];
						this.map.set(r, i);
					}))
				: (this.map = null);
	}
	has(e) {
		return this.init(), this.map.has(e);
	}
	get(e) {
		this.init();
		let r = this.map.get(e);
		return r ? r[0] : null;
	}
	getAll(e) {
		return this.init(), this.map.get(e) || null;
	}
	keys() {
		return this.init(), Array.from(this.map.keys());
	}
	append(e, r) {
		return this.clone({ param: e, value: r, op: "a" });
	}
	appendAll(e) {
		let r = [];
		return (
			Object.keys(e).forEach((n) => {
				let i = e[n];
				Array.isArray(i)
					? i.forEach((o) => {
							r.push({ param: n, value: o, op: "a" });
						})
					: r.push({ param: n, value: i, op: "a" });
			}),
			this.clone(r)
		);
	}
	set(e, r) {
		return this.clone({ param: e, value: r, op: "s" });
	}
	delete(e, r) {
		return this.clone({ param: e, value: r, op: "d" });
	}
	toString() {
		return (
			this.init(),
			this.keys()
				.map((e) => {
					let r = this.encoder.encodeKey(e);
					return this.map
						.get(e)
						.map((n) => r + "=" + this.encoder.encodeValue(n))
						.join("&");
				})
				.filter((e) => e !== "")
				.join("&")
		);
	}
	clone(e) {
		let r = new t({ encoder: this.encoder });
		return (
			(r.cloneFrom = this.cloneFrom || this),
			(r.updates = (this.updates || []).concat(e)),
			r
		);
	}
	init() {
		this.map === null && (this.map = new Map()),
			this.cloneFrom !== null &&
				(this.cloneFrom.init(),
				this.cloneFrom
					.keys()
					.forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
				this.updates.forEach((e) => {
					switch (e.op) {
						case "a":
						case "s":
							let r =
								(e.op === "a"
									? this.map.get(e.param)
									: void 0) || [];
							r.push(mo(e.value)), this.map.set(e.param, r);
							break;
						case "d":
							if (e.value !== void 0) {
								let n = this.map.get(e.param) || [],
									i = n.indexOf(mo(e.value));
								i !== -1 && n.splice(i, 1),
									n.length > 0
										? this.map.set(e.param, n)
										: this.map.delete(e.param);
							} else {
								this.map.delete(e.param);
								break;
							}
					}
				}),
				(this.cloneFrom = this.updates = null));
	}
};
var au = class {
	constructor() {
		this.map = new Map();
	}
	set(e, r) {
		return this.map.set(e, r), this;
	}
	get(e) {
		return (
			this.map.has(e) || this.map.set(e, e.defaultValue()),
			this.map.get(e)
		);
	}
	delete(e) {
		return this.map.delete(e), this;
	}
	has(e) {
		return this.map.has(e);
	}
	keys() {
		return this.map.keys();
	}
};
function KC(t) {
	switch (t) {
		case "DELETE":
		case "GET":
		case "HEAD":
		case "OPTIONS":
		case "JSONP":
			return !1;
		default:
			return !0;
	}
}
function sh(t) {
	return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function ah(t) {
	return typeof Blob < "u" && t instanceof Blob;
}
function uh(t) {
	return typeof FormData < "u" && t instanceof FormData;
}
function JC(t) {
	return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var hr = class t {
		constructor(e, r, n, i) {
			(this.url = r),
				(this.body = null),
				(this.reportProgress = !1),
				(this.withCredentials = !1),
				(this.responseType = "json"),
				(this.method = e.toUpperCase());
			let o;
			if (
				(KC(this.method) || i
					? ((this.body = n !== void 0 ? n : null), (o = i))
					: (o = n),
				o &&
					((this.reportProgress = !!o.reportProgress),
					(this.withCredentials = !!o.withCredentials),
					o.responseType && (this.responseType = o.responseType),
					o.headers && (this.headers = o.headers),
					o.context && (this.context = o.context),
					o.params && (this.params = o.params),
					(this.transferCache = o.transferCache)),
				this.headers || (this.headers = new pt()),
				this.context || (this.context = new au()),
				!this.params)
			)
				(this.params = new ht()), (this.urlWithParams = r);
			else {
				let s = this.params.toString();
				if (s.length === 0) this.urlWithParams = r;
				else {
					let a = r.indexOf("?"),
						u = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
					this.urlWithParams = r + u + s;
				}
			}
		}
		serializeBody() {
			return this.body === null
				? null
				: sh(this.body) ||
					  ah(this.body) ||
					  uh(this.body) ||
					  JC(this.body) ||
					  typeof this.body == "string"
					? this.body
					: this.body instanceof ht
						? this.body.toString()
						: typeof this.body == "object" ||
							  typeof this.body == "boolean" ||
							  Array.isArray(this.body)
							? JSON.stringify(this.body)
							: this.body.toString();
		}
		detectContentTypeHeader() {
			return this.body === null || uh(this.body)
				? null
				: ah(this.body)
					? this.body.type || null
					: sh(this.body)
						? null
						: typeof this.body == "string"
							? "text/plain"
							: this.body instanceof ht
								? "application/x-www-form-urlencoded;charset=UTF-8"
								: typeof this.body == "object" ||
									  typeof this.body == "number" ||
									  typeof this.body == "boolean"
									? "application/json"
									: null;
		}
		clone(e = {}) {
			let r = e.method || this.method,
				n = e.url || this.url,
				i = e.responseType || this.responseType,
				o = e.body !== void 0 ? e.body : this.body,
				s =
					e.withCredentials !== void 0
						? e.withCredentials
						: this.withCredentials,
				a =
					e.reportProgress !== void 0
						? e.reportProgress
						: this.reportProgress,
				u = e.headers || this.headers,
				c = e.params || this.params,
				l = e.context ?? this.context;
			return (
				e.setHeaders !== void 0 &&
					(u = Object.keys(e.setHeaders).reduce(
						(d, f) => d.set(f, e.setHeaders[f]),
						u,
					)),
				e.setParams &&
					(c = Object.keys(e.setParams).reduce(
						(d, f) => d.set(f, e.setParams[f]),
						c,
					)),
				new t(r, n, o, {
					params: c,
					headers: u,
					context: l,
					reportProgress: a,
					responseType: i,
					withCredentials: s,
				})
			);
		}
	},
	bn = (function (t) {
		return (
			(t[(t.Sent = 0)] = "Sent"),
			(t[(t.UploadProgress = 1)] = "UploadProgress"),
			(t[(t.ResponseHeader = 2)] = "ResponseHeader"),
			(t[(t.DownloadProgress = 3)] = "DownloadProgress"),
			(t[(t.Response = 4)] = "Response"),
			(t[(t.User = 5)] = "User"),
			t
		);
	})(bn || {}),
	gr = class {
		constructor(e, r = 200, n = "OK") {
			(this.headers = e.headers || new pt()),
				(this.status = e.status !== void 0 ? e.status : r),
				(this.statusText = e.statusText || n),
				(this.url = e.url || null),
				(this.ok = this.status >= 200 && this.status < 300);
		}
	},
	uu = class t extends gr {
		constructor(e = {}) {
			super(e), (this.type = bn.ResponseHeader);
		}
		clone(e = {}) {
			return new t({
				headers: e.headers || this.headers,
				status: e.status !== void 0 ? e.status : this.status,
				statusText: e.statusText || this.statusText,
				url: e.url || this.url || void 0,
			});
		}
	},
	Mn = class t extends gr {
		constructor(e = {}) {
			super(e),
				(this.type = bn.Response),
				(this.body = e.body !== void 0 ? e.body : null);
		}
		clone(e = {}) {
			return new t({
				body: e.body !== void 0 ? e.body : this.body,
				headers: e.headers || this.headers,
				status: e.status !== void 0 ? e.status : this.status,
				statusText: e.statusText || this.statusText,
				url: e.url || this.url || void 0,
			});
		}
	},
	Do = class extends gr {
		constructor(e) {
			super(e, 0, "Unknown Error"),
				(this.name = "HttpErrorResponse"),
				(this.ok = !1),
				this.status >= 200 && this.status < 300
					? (this.message = `Http failure during parsing for ${
							e.url || "(unknown url)"
						}`)
					: (this.message = `Http failure response for ${
							e.url || "(unknown url)"
						}: ${e.status} ${e.statusText}`),
				(this.error = e.error || null);
		}
	};
function ou(t, e) {
	return {
		body: e,
		headers: t.headers,
		context: t.context,
		observe: t.observe,
		params: t.params,
		reportProgress: t.reportProgress,
		responseType: t.responseType,
		withCredentials: t.withCredentials,
		transferCache: t.transferCache,
	};
}
var Pt = (() => {
	let e = class e {
		constructor(n) {
			this.handler = n;
		}
		request(n, i, o = {}) {
			let s;
			if (n instanceof hr) s = n;
			else {
				let c;
				o.headers instanceof pt
					? (c = o.headers)
					: (c = new pt(o.headers));
				let l;
				o.params &&
					(o.params instanceof ht
						? (l = o.params)
						: (l = new ht({ fromObject: o.params }))),
					(s = new hr(n, i, o.body !== void 0 ? o.body : null, {
						headers: c,
						context: o.context,
						params: l,
						reportProgress: o.reportProgress,
						responseType: o.responseType || "json",
						withCredentials: o.withCredentials,
						transferCache: o.transferCache,
					}));
			}
			let a = M(s).pipe(tt((c) => this.handler.handle(c)));
			if (n instanceof hr || o.observe === "events") return a;
			let u = a.pipe(ue((c) => c instanceof Mn));
			switch (o.observe || "body") {
				case "body":
					switch (s.responseType) {
						case "arraybuffer":
							return u.pipe(
								E((c) => {
									if (
										c.body !== null &&
										!(c.body instanceof ArrayBuffer)
									)
										throw new Error(
											"Response is not an ArrayBuffer.",
										);
									return c.body;
								}),
							);
						case "blob":
							return u.pipe(
								E((c) => {
									if (
										c.body !== null &&
										!(c.body instanceof Blob)
									)
										throw new Error(
											"Response is not a Blob.",
										);
									return c.body;
								}),
							);
						case "text":
							return u.pipe(
								E((c) => {
									if (
										c.body !== null &&
										typeof c.body != "string"
									)
										throw new Error(
											"Response is not a string.",
										);
									return c.body;
								}),
							);
						case "json":
						default:
							return u.pipe(E((c) => c.body));
					}
				case "response":
					return u;
				default:
					throw new Error(
						`Unreachable: unhandled observe type ${o.observe}}`,
					);
			}
		}
		delete(n, i = {}) {
			return this.request("DELETE", n, i);
		}
		get(n, i = {}) {
			return this.request("GET", n, i);
		}
		head(n, i = {}) {
			return this.request("HEAD", n, i);
		}
		jsonp(n, i) {
			return this.request("JSONP", n, {
				params: new ht().append(i, "JSONP_CALLBACK"),
				observe: "body",
				responseType: "json",
			});
		}
		options(n, i = {}) {
			return this.request("OPTIONS", n, i);
		}
		patch(n, i, o = {}) {
			return this.request("PATCH", n, ou(o, i));
		}
		post(n, i, o = {}) {
			return this.request("POST", n, ou(o, i));
		}
		put(n, i, o = {}) {
			return this.request("PUT", n, ou(o, i));
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)(D(pr));
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac }));
	let t = e;
	return t;
})();
function XC(t, e) {
	return e(t);
}
function ew(t, e, r) {
	return (n, i) => Qe(r, () => e(n, (o) => t(o, i)));
}
var vh = new w(""),
	yh = new w(""),
	tw = new w("");
var ch = (() => {
	let e = class e extends pr {
		constructor(n, i) {
			super(),
				(this.backend = n),
				(this.injector = i),
				(this.chain = null),
				(this.pendingTasks = p(wn));
			let o = p(tw, { optional: !0 });
			this.backend = o ?? n;
		}
		handle(n) {
			if (this.chain === null) {
				let o = Array.from(
					new Set([
						...this.injector.get(vh),
						...this.injector.get(yh, []),
					]),
				);
				this.chain = o.reduceRight(
					(s, a) => ew(s, a, this.injector),
					XC,
				);
			}
			let i = this.pendingTasks.add();
			return this.chain(n, (o) => this.backend.handle(o)).pipe(
				wt(() => this.pendingTasks.remove(i)),
			);
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)(D(yo), D(re));
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac }));
	let t = e;
	return t;
})();
var nw = /^\)\]\}',?\n/;
function rw(t) {
	return "responseURL" in t && t.responseURL
		? t.responseURL
		: /^X-Request-URL:/m.test(t.getAllResponseHeaders())
			? t.getResponseHeader("X-Request-URL")
			: null;
}
var lh = (() => {
		let e = class e {
			constructor(n) {
				this.xhrFactory = n;
			}
			handle(n) {
				if (n.method === "JSONP") throw new C(-2800, !1);
				let i = this.xhrFactory;
				return (i.ɵloadImpl ? $(i.ɵloadImpl()) : M(null)).pipe(
					ce(
						() =>
							new F((s) => {
								let a = i.build();
								if (
									(a.open(n.method, n.urlWithParams),
									n.withCredentials &&
										(a.withCredentials = !0),
									n.headers.forEach((b, y) =>
										a.setRequestHeader(b, y.join(",")),
									),
									n.headers.has("Accept") ||
										a.setRequestHeader(
											"Accept",
											"application/json, text/plain, */*",
										),
									!n.headers.has("Content-Type"))
								) {
									let b = n.detectContentTypeHeader();
									b !== null &&
										a.setRequestHeader("Content-Type", b);
								}
								if (n.responseType) {
									let b = n.responseType.toLowerCase();
									a.responseType = b !== "json" ? b : "text";
								}
								let u = n.serializeBody(),
									c = null,
									l = () => {
										if (c !== null) return c;
										let b = a.statusText || "OK",
											y = new pt(
												a.getAllResponseHeaders(),
											),
											U = rw(a) || n.url;
										return (
											(c = new uu({
												headers: y,
												status: a.status,
												statusText: b,
												url: U,
											})),
											c
										);
									},
									d = () => {
										let {
												headers: b,
												status: y,
												statusText: U,
												url: me,
											} = l(),
											V = null;
										y !== 204 &&
											(V =
												typeof a.response > "u"
													? a.responseText
													: a.response),
											y === 0 && (y = V ? 200 : 0);
										let te = y >= 200 && y < 300;
										if (
											n.responseType === "json" &&
											typeof V == "string"
										) {
											let be = V;
											V = V.replace(nw, "");
											try {
												V =
													V !== ""
														? JSON.parse(V)
														: null;
											} catch (kn) {
												(V = be),
													te &&
														((te = !1),
														(V = {
															error: kn,
															text: V,
														}));
											}
										}
										te
											? (s.next(
													new Mn({
														body: V,
														headers: b,
														status: y,
														statusText: U,
														url: me || void 0,
													}),
												),
												s.complete())
											: s.error(
													new Do({
														error: V,
														headers: b,
														status: y,
														statusText: U,
														url: me || void 0,
													}),
												);
									},
									f = (b) => {
										let { url: y } = l(),
											U = new Do({
												error: b,
												status: a.status || 0,
												statusText:
													a.statusText ||
													"Unknown Error",
												url: y || void 0,
											});
										s.error(U);
									},
									h = !1,
									g = (b) => {
										h || (s.next(l()), (h = !0));
										let y = {
											type: bn.DownloadProgress,
											loaded: b.loaded,
										};
										b.lengthComputable &&
											(y.total = b.total),
											n.responseType === "text" &&
												a.responseText &&
												(y.partialText =
													a.responseText),
											s.next(y);
									},
									T = (b) => {
										let y = {
											type: bn.UploadProgress,
											loaded: b.loaded,
										};
										b.lengthComputable &&
											(y.total = b.total),
											s.next(y);
									};
								return (
									a.addEventListener("load", d),
									a.addEventListener("error", f),
									a.addEventListener("timeout", f),
									a.addEventListener("abort", f),
									n.reportProgress &&
										(a.addEventListener("progress", g),
										u !== null &&
											a.upload &&
											a.upload.addEventListener(
												"progress",
												T,
											)),
									a.send(u),
									s.next({ type: bn.Sent }),
									() => {
										a.removeEventListener("error", f),
											a.removeEventListener("abort", f),
											a.removeEventListener("load", d),
											a.removeEventListener("timeout", f),
											n.reportProgress &&
												(a.removeEventListener(
													"progress",
													g,
												),
												u !== null &&
													a.upload &&
													a.upload.removeEventListener(
														"progress",
														T,
													)),
											a.readyState !== a.DONE &&
												a.abort();
									}
								);
							}),
					),
				);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(D(In));
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac }));
		let t = e;
		return t;
	})(),
	Dh = new w("XSRF_ENABLED"),
	iw = "XSRF-TOKEN",
	ow = new w("XSRF_COOKIE_NAME", { providedIn: "root", factory: () => iw }),
	sw = "X-XSRF-TOKEN",
	aw = new w("XSRF_HEADER_NAME", { providedIn: "root", factory: () => sw }),
	Co = class {},
	uw = (() => {
		let e = class e {
			constructor(n, i, o) {
				(this.doc = n),
					(this.platform = i),
					(this.cookieName = o),
					(this.lastCookieString = ""),
					(this.lastToken = null),
					(this.parseCount = 0);
			}
			getToken() {
				if (this.platform === "server") return null;
				let n = this.doc.cookie || "";
				return (
					n !== this.lastCookieString &&
						(this.parseCount++,
						(this.lastToken = go(n, this.cookieName)),
						(this.lastCookieString = n)),
					this.lastToken
				);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(D(ee), D(je), D(ow));
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac }));
		let t = e;
		return t;
	})();
function cw(t, e) {
	let r = t.url.toLowerCase();
	if (
		!p(Dh) ||
		t.method === "GET" ||
		t.method === "HEAD" ||
		r.startsWith("http://") ||
		r.startsWith("https://")
	)
		return e(t);
	let n = p(Co).getToken(),
		i = p(aw);
	return (
		n != null &&
			!t.headers.has(i) &&
			(t = t.clone({ headers: t.headers.set(i, n) })),
		e(t)
	);
}
function Ch(...t) {
	let e = [
		Pt,
		lh,
		ch,
		{ provide: pr, useExisting: ch },
		{ provide: yo, useExisting: lh },
		{ provide: vh, useValue: cw, multi: !0 },
		{ provide: Dh, useValue: !0 },
		{ provide: Co, useClass: uw },
	];
	for (let r of t) e.push(...r.ɵproviders);
	return ct(e);
}
var dh = "b",
	fh = "h",
	hh = "s",
	ph = "st",
	gh = "u",
	mh = "rt",
	vo = new w(""),
	lw = ["GET", "HEAD"];
function dw(t, e) {
	let l = p(vo),
		{ isCacheActive: r } = l,
		n = hc(l, ["isCacheActive"]),
		{ transferCache: i, method: o } = t;
	if (
		!r ||
		(o === "POST" && !n.includePostRequests && !i) ||
		(o !== "POST" && !lw.includes(o)) ||
		i === !1 ||
		n.filter?.(t) === !1
	)
		return e(t);
	let s = p(Nt),
		a = hw(t),
		u = s.get(a, null),
		c = n.includeHeaders;
	if (
		(typeof i == "object" && i.includeHeaders && (c = i.includeHeaders), u)
	) {
		let { [dh]: d, [mh]: f, [fh]: h, [hh]: g, [ph]: T, [gh]: b } = u,
			y = d;
		switch (f) {
			case "arraybuffer":
				y = new TextEncoder().encode(d).buffer;
				break;
			case "blob":
				y = new Blob([d]);
				break;
		}
		let U = new pt(h);
		return M(
			new Mn({ body: y, headers: U, status: g, statusText: T, url: b }),
		);
	}
	return e(t).pipe(
		G((d) => {
			d instanceof Mn &&
				s.set(a, {
					[dh]: d.body,
					[fh]: fw(d.headers, c),
					[hh]: d.status,
					[ph]: d.statusText,
					[gh]: d.url || "",
					[mh]: t.responseType,
				});
		}),
	);
}
function fw(t, e) {
	if (!e) return {};
	let r = {};
	for (let n of e) {
		let i = t.getAll(n);
		i !== null && (r[n] = i);
	}
	return r;
}
function hw(t) {
	let { params: e, method: r, responseType: n, url: i } = t,
		o = e
			.keys()
			.sort()
			.map((u) => `${u}=${e.getAll(u)}`)
			.join("&"),
		s = r + "." + n + "." + i + "?" + o,
		a = pw(s);
	return a;
}
function pw(t) {
	let e = 0;
	for (let r of t) e = (Math.imul(31, e) + r.charCodeAt(0)) << 0;
	return (e += 2147483647 + 1), e.toString();
}
function wh(t) {
	return [
		{
			provide: vo,
			useFactory: () => (
				cr("NgHttpTransferCache"), m({ isCacheActive: !0 }, t)
			),
		},
		{ provide: yh, useValue: dw, multi: !0, deps: [Nt, vo] },
		{
			provide: En,
			multi: !0,
			useFactory: () => {
				let e = p(ft),
					r = p(vo);
				return () => {
					Ja(e).then(() => {
						r.isCacheActive = !1;
					});
				};
			},
		},
	];
}
var fu = class extends ho {
		constructor() {
			super(...arguments), (this.supportsDOMEvents = !0);
		}
	},
	hu = class t extends fu {
		static makeCurrent() {
			Kf(new t());
		}
		onAndCancel(e, r, n) {
			return (
				e.addEventListener(r, n),
				() => {
					e.removeEventListener(r, n);
				}
			);
		}
		dispatchEvent(e, r) {
			e.dispatchEvent(r);
		}
		remove(e) {
			e.parentNode && e.parentNode.removeChild(e);
		}
		createElement(e, r) {
			return (r = r || this.getDefaultDocument()), r.createElement(e);
		}
		createHtmlDocument() {
			return document.implementation.createHTMLDocument("fakeTitle");
		}
		getDefaultDocument() {
			return document;
		}
		isElementNode(e) {
			return e.nodeType === Node.ELEMENT_NODE;
		}
		isShadowRoot(e) {
			return e instanceof DocumentFragment;
		}
		getGlobalEventTarget(e, r) {
			return r === "window"
				? window
				: r === "document"
					? e
					: r === "body"
						? e.body
						: null;
		}
		getBaseHref(e) {
			let r = gw();
			return r == null ? null : mw(r);
		}
		resetBaseElement() {
			mr = null;
		}
		getUserAgent() {
			return window.navigator.userAgent;
		}
		getCookie(e) {
			return go(document.cookie, e);
		}
	},
	mr = null;
function gw() {
	return (
		(mr = mr || document.querySelector("base")),
		mr ? mr.getAttribute("href") : null
	);
}
function mw(t) {
	return new URL(t, document.baseURI).pathname;
}
var vw = (() => {
		let e = class e {
			build() {
				return new XMLHttpRequest();
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac }));
		let t = e;
		return t;
	})(),
	pu = new w("EventManagerPlugins"),
	Mh = (() => {
		let e = class e {
			constructor(n, i) {
				(this._zone = i),
					(this._eventNameToPlugin = new Map()),
					n.forEach((o) => {
						o.manager = this;
					}),
					(this._plugins = n.slice().reverse());
			}
			addEventListener(n, i, o) {
				return this._findPluginFor(i).addEventListener(n, i, o);
			}
			getZone() {
				return this._zone;
			}
			_findPluginFor(n) {
				let i = this._eventNameToPlugin.get(n);
				if (i) return i;
				if (((i = this._plugins.find((s) => s.supports(n))), !i))
					throw new C(5101, !1);
				return this._eventNameToPlugin.set(n, i), i;
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(D(pu), D(B));
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac }));
		let t = e;
		return t;
	})(),
	wo = class {
		constructor(e) {
			this._doc = e;
		}
	},
	lu = "ng-app-id",
	_h = (() => {
		let e = class e {
			constructor(n, i, o, s = {}) {
				(this.doc = n),
					(this.appId = i),
					(this.nonce = o),
					(this.platformId = s),
					(this.styleRef = new Map()),
					(this.hostNodes = new Set()),
					(this.styleNodesInDOM = this.collectServerRenderedStyles()),
					(this.platformIsServer = iu(s)),
					this.resetHostNodes();
			}
			addStyles(n) {
				for (let i of n)
					this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
			}
			removeStyles(n) {
				for (let i of n)
					this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
			}
			ngOnDestroy() {
				let n = this.styleNodesInDOM;
				n && (n.forEach((i) => i.remove()), n.clear());
				for (let i of this.getAllStyles()) this.onStyleRemoved(i);
				this.resetHostNodes();
			}
			addHost(n) {
				this.hostNodes.add(n);
				for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
			}
			removeHost(n) {
				this.hostNodes.delete(n);
			}
			getAllStyles() {
				return this.styleRef.keys();
			}
			onStyleAdded(n) {
				for (let i of this.hostNodes) this.addStyleToHost(i, n);
			}
			onStyleRemoved(n) {
				let i = this.styleRef;
				i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
			}
			collectServerRenderedStyles() {
				let n = this.doc.head?.querySelectorAll(
					`style[${lu}="${this.appId}"]`,
				);
				if (n?.length) {
					let i = new Map();
					return (
						n.forEach((o) => {
							o.textContent != null && i.set(o.textContent, o);
						}),
						i
					);
				}
				return null;
			}
			changeUsageCount(n, i) {
				let o = this.styleRef;
				if (o.has(n)) {
					let s = o.get(n);
					return (s.usage += i), s.usage;
				}
				return o.set(n, { usage: i, elements: [] }), i;
			}
			getStyleElement(n, i) {
				let o = this.styleNodesInDOM,
					s = o?.get(i);
				if (s?.parentNode === n)
					return o.delete(i), s.removeAttribute(lu), s;
				{
					let a = this.doc.createElement("style");
					return (
						this.nonce && a.setAttribute("nonce", this.nonce),
						(a.textContent = i),
						this.platformIsServer && a.setAttribute(lu, this.appId),
						n.appendChild(a),
						a
					);
				}
			}
			addStyleToHost(n, i) {
				let o = this.getStyleElement(n, i),
					s = this.styleRef,
					a = s.get(i)?.elements;
				a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
			}
			resetHostNodes() {
				let n = this.hostNodes;
				n.clear(), n.add(this.doc.head);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(D(ee), D(Ki), D(Ta, 8), D(je));
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac }));
		let t = e;
		return t;
	})(),
	du = {
		svg: "http://www.w3.org/2000/svg",
		xhtml: "http://www.w3.org/1999/xhtml",
		xlink: "http://www.w3.org/1999/xlink",
		xml: "http://www.w3.org/XML/1998/namespace",
		xmlns: "http://www.w3.org/2000/xmlns/",
		math: "http://www.w3.org/1998/MathML/",
	},
	mu = /%COMP%/g,
	Sh = "%COMP%",
	yw = `_nghost-${Sh}`,
	Dw = `_ngcontent-${Sh}`,
	Cw = !0,
	ww = new w("RemoveStylesOnCompDestroy", {
		providedIn: "root",
		factory: () => Cw,
	});
function Ew(t) {
	return Dw.replace(mu, t);
}
function Iw(t) {
	return yw.replace(mu, t);
}
function Th(t, e) {
	return e.map((r) => r.replace(mu, t));
}
var Eh = (() => {
		let e = class e {
			constructor(n, i, o, s, a, u, c, l = null) {
				(this.eventManager = n),
					(this.sharedStylesHost = i),
					(this.appId = o),
					(this.removeStylesOnCompDestroy = s),
					(this.doc = a),
					(this.platformId = u),
					(this.ngZone = c),
					(this.nonce = l),
					(this.rendererByCompId = new Map()),
					(this.platformIsServer = iu(u)),
					(this.defaultRenderer = new vr(
						n,
						a,
						c,
						this.platformIsServer,
					));
			}
			createRenderer(n, i) {
				if (!n || !i) return this.defaultRenderer;
				this.platformIsServer &&
					i.encapsulation === ke.ShadowDom &&
					(i = j(m({}, i), { encapsulation: ke.Emulated }));
				let o = this.getOrCreateRenderer(n, i);
				return (
					o instanceof Eo
						? o.applyToHost(n)
						: o instanceof yr && o.applyStyles(),
					o
				);
			}
			getOrCreateRenderer(n, i) {
				let o = this.rendererByCompId,
					s = o.get(i.id);
				if (!s) {
					let a = this.doc,
						u = this.ngZone,
						c = this.eventManager,
						l = this.sharedStylesHost,
						d = this.removeStylesOnCompDestroy,
						f = this.platformIsServer;
					switch (i.encapsulation) {
						case ke.Emulated:
							s = new Eo(c, l, i, this.appId, d, a, u, f);
							break;
						case ke.ShadowDom:
							return new gu(c, l, n, i, a, u, this.nonce, f);
						default:
							s = new yr(c, l, i, d, a, u, f);
							break;
					}
					o.set(i.id, s);
				}
				return s;
			}
			ngOnDestroy() {
				this.rendererByCompId.clear();
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(
				D(Mh),
				D(_h),
				D(Ki),
				D(ww),
				D(ee),
				D(je),
				D(B),
				D(Ta),
			);
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac }));
		let t = e;
		return t;
	})(),
	vr = class {
		constructor(e, r, n, i) {
			(this.eventManager = e),
				(this.doc = r),
				(this.ngZone = n),
				(this.platformIsServer = i),
				(this.data = Object.create(null)),
				(this.throwOnSyntheticProps = !0),
				(this.destroyNode = null);
		}
		destroy() {}
		createElement(e, r) {
			return r
				? this.doc.createElementNS(du[r] || r, e)
				: this.doc.createElement(e);
		}
		createComment(e) {
			return this.doc.createComment(e);
		}
		createText(e) {
			return this.doc.createTextNode(e);
		}
		appendChild(e, r) {
			(Ih(e) ? e.content : e).appendChild(r);
		}
		insertBefore(e, r, n) {
			e && (Ih(e) ? e.content : e).insertBefore(r, n);
		}
		removeChild(e, r) {
			e && e.removeChild(r);
		}
		selectRootElement(e, r) {
			let n = typeof e == "string" ? this.doc.querySelector(e) : e;
			if (!n) throw new C(-5104, !1);
			return r || (n.textContent = ""), n;
		}
		parentNode(e) {
			return e.parentNode;
		}
		nextSibling(e) {
			return e.nextSibling;
		}
		setAttribute(e, r, n, i) {
			if (i) {
				r = i + ":" + r;
				let o = du[i];
				o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
			} else e.setAttribute(r, n);
		}
		removeAttribute(e, r, n) {
			if (n) {
				let i = du[n];
				i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
			} else e.removeAttribute(r);
		}
		addClass(e, r) {
			e.classList.add(r);
		}
		removeClass(e, r) {
			e.classList.remove(r);
		}
		setStyle(e, r, n, i) {
			i & (We.DashCase | We.Important)
				? e.style.setProperty(r, n, i & We.Important ? "important" : "")
				: (e.style[r] = n);
		}
		removeStyle(e, r, n) {
			n & We.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
		}
		setProperty(e, r, n) {
			e != null && (e[r] = n);
		}
		setValue(e, r) {
			e.nodeValue = r;
		}
		listen(e, r, n) {
			if (
				typeof e == "string" &&
				((e = Je().getGlobalEventTarget(this.doc, e)), !e)
			)
				throw new Error(`Unsupported event target ${e} for event ${r}`);
			return this.eventManager.addEventListener(
				e,
				r,
				this.decoratePreventDefault(n),
			);
		}
		decoratePreventDefault(e) {
			return (r) => {
				if (r === "__ngUnwrap__") return e;
				(this.platformIsServer
					? this.ngZone.runGuarded(() => e(r))
					: e(r)) === !1 && r.preventDefault();
			};
		}
	};
function Ih(t) {
	return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var gu = class extends vr {
		constructor(e, r, n, i, o, s, a, u) {
			super(e, o, s, u),
				(this.sharedStylesHost = r),
				(this.hostEl = n),
				(this.shadowRoot = n.attachShadow({ mode: "open" })),
				this.sharedStylesHost.addHost(this.shadowRoot);
			let c = Th(i.id, i.styles);
			for (let l of c) {
				let d = document.createElement("style");
				a && d.setAttribute("nonce", a),
					(d.textContent = l),
					this.shadowRoot.appendChild(d);
			}
		}
		nodeOrShadowRoot(e) {
			return e === this.hostEl ? this.shadowRoot : e;
		}
		appendChild(e, r) {
			return super.appendChild(this.nodeOrShadowRoot(e), r);
		}
		insertBefore(e, r, n) {
			return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
		}
		removeChild(e, r) {
			return super.removeChild(this.nodeOrShadowRoot(e), r);
		}
		parentNode(e) {
			return this.nodeOrShadowRoot(
				super.parentNode(this.nodeOrShadowRoot(e)),
			);
		}
		destroy() {
			this.sharedStylesHost.removeHost(this.shadowRoot);
		}
	},
	yr = class extends vr {
		constructor(e, r, n, i, o, s, a, u) {
			super(e, o, s, a),
				(this.sharedStylesHost = r),
				(this.removeStylesOnCompDestroy = i),
				(this.styles = u ? Th(u, n.styles) : n.styles);
		}
		applyStyles() {
			this.sharedStylesHost.addStyles(this.styles);
		}
		destroy() {
			this.removeStylesOnCompDestroy &&
				this.sharedStylesHost.removeStyles(this.styles);
		}
	},
	Eo = class extends yr {
		constructor(e, r, n, i, o, s, a, u) {
			let c = i + "-" + n.id;
			super(e, r, n, o, s, a, u, c),
				(this.contentAttr = Ew(c)),
				(this.hostAttr = Iw(c));
		}
		applyToHost(e) {
			this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
		}
		createElement(e, r) {
			let n = super.createElement(e, r);
			return super.setAttribute(n, this.contentAttr, ""), n;
		}
	},
	bw = (() => {
		let e = class e extends wo {
			constructor(n) {
				super(n);
			}
			supports(n) {
				return !0;
			}
			addEventListener(n, i, o) {
				return (
					n.addEventListener(i, o, !1),
					() => this.removeEventListener(n, i, o)
				);
			}
			removeEventListener(n, i, o) {
				return n.removeEventListener(i, o);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(D(ee));
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac }));
		let t = e;
		return t;
	})(),
	bh = ["alt", "control", "meta", "shift"],
	Mw = {
		"\b": "Backspace",
		"	": "Tab",
		"\x7F": "Delete",
		"\x1B": "Escape",
		Del: "Delete",
		Esc: "Escape",
		Left: "ArrowLeft",
		Right: "ArrowRight",
		Up: "ArrowUp",
		Down: "ArrowDown",
		Menu: "ContextMenu",
		Scroll: "ScrollLock",
		Win: "OS",
	},
	_w = {
		alt: (t) => t.altKey,
		control: (t) => t.ctrlKey,
		meta: (t) => t.metaKey,
		shift: (t) => t.shiftKey,
	},
	Sw = (() => {
		let e = class e extends wo {
			constructor(n) {
				super(n);
			}
			supports(n) {
				return e.parseEventName(n) != null;
			}
			addEventListener(n, i, o) {
				let s = e.parseEventName(i),
					a = e.eventCallback(s.fullKey, o, this.manager.getZone());
				return this.manager
					.getZone()
					.runOutsideAngular(() =>
						Je().onAndCancel(n, s.domEventName, a),
					);
			}
			static parseEventName(n) {
				let i = n.toLowerCase().split("."),
					o = i.shift();
				if (i.length === 0 || !(o === "keydown" || o === "keyup"))
					return null;
				let s = e._normalizeKey(i.pop()),
					a = "",
					u = i.indexOf("code");
				if (
					(u > -1 && (i.splice(u, 1), (a = "code.")),
					bh.forEach((l) => {
						let d = i.indexOf(l);
						d > -1 && (i.splice(d, 1), (a += l + "."));
					}),
					(a += s),
					i.length != 0 || s.length === 0)
				)
					return null;
				let c = {};
				return (c.domEventName = o), (c.fullKey = a), c;
			}
			static matchEventFullKeyCode(n, i) {
				let o = Mw[n.key] || n.key,
					s = "";
				return (
					i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
					o == null || !o
						? !1
						: ((o = o.toLowerCase()),
							o === " "
								? (o = "space")
								: o === "." && (o = "dot"),
							bh.forEach((a) => {
								if (a !== o) {
									let u = _w[a];
									u(n) && (s += a + ".");
								}
							}),
							(s += o),
							s === i)
				);
			}
			static eventCallback(n, i, o) {
				return (s) => {
					e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
				};
			}
			static _normalizeKey(n) {
				return n === "esc" ? "escape" : n;
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(D(ee));
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac }));
		let t = e;
		return t;
	})();
function xh(t, e) {
	return Gf(m({ rootComponent: t }, Tw(e)));
}
function Tw(t) {
	return {
		appProviders: [...Rw, ...(t?.providers ?? [])],
		platformProviders: Ow,
	};
}
function xw() {
	hu.makeCurrent();
}
function Aw() {
	return new qe();
}
function Nw() {
	return Pd(document), document;
}
var Ow = [
	{ provide: je, useValue: rh },
	{ provide: Sa, useValue: xw, multi: !0 },
	{ provide: ee, useFactory: Nw, deps: [] },
];
var Rw = [
	{ provide: Yi, useValue: "root" },
	{ provide: qe, useFactory: Aw, deps: [] },
	{ provide: pu, useClass: bw, multi: !0, deps: [ee, B, je] },
	{ provide: pu, useClass: Sw, multi: !0, deps: [ee] },
	Eh,
	_h,
	Mh,
	{ provide: Kn, useExisting: Eh },
	{ provide: In, useClass: vw, deps: [] },
	[],
];
function Fw() {
	return new vu(D(ee));
}
var vu = (() => {
	let e = class e {
		constructor(n) {
			this._doc = n;
		}
		getTitle() {
			return this._doc.title;
		}
		setTitle(n) {
			this._doc.title = n || "";
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)(D(ee));
	}),
		(e.ɵprov = v({
			token: e,
			factory: function (i) {
				let o = null;
				return i ? (o = new i()) : (o = Fw()), o;
			},
			providedIn: "root",
		}));
	let t = e;
	return t;
})();
function Ah(...t) {
	let e = [],
		r = new Set(),
		n = r.has(1);
	for (let { ɵproviders: i, ɵkind: o } of t) r.add(o), i.length && e.push(i);
	return ct([[], Wf(), r.has(0) || n ? [] : wh({}), e]);
}
var S = "primary",
	Rr = Symbol("RouteTitle"),
	Eu = class {
		constructor(e) {
			this.params = e || {};
		}
		has(e) {
			return Object.prototype.hasOwnProperty.call(this.params, e);
		}
		get(e) {
			if (this.has(e)) {
				let r = this.params[e];
				return Array.isArray(r) ? r[0] : r;
			}
			return null;
		}
		getAll(e) {
			if (this.has(e)) {
				let r = this.params[e];
				return Array.isArray(r) ? r : [r];
			}
			return [];
		}
		get keys() {
			return Object.keys(this.params);
		}
	};
function An(t) {
	return new Eu(t);
}
function Lw(t, e, r) {
	let n = r.path.split("/");
	if (
		n.length > t.length ||
		(r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
	)
		return null;
	let i = {};
	for (let o = 0; o < n.length; o++) {
		let s = n[o],
			a = t[o];
		if (s.startsWith(":")) i[s.substring(1)] = a;
		else if (s !== a.path) return null;
	}
	return { consumed: t.slice(0, n.length), posParams: i };
}
function Vw(t, e) {
	if (t.length !== e.length) return !1;
	for (let r = 0; r < t.length; ++r) if (!$e(t[r], e[r])) return !1;
	return !0;
}
function $e(t, e) {
	let r = t ? Iu(t) : void 0,
		n = e ? Iu(e) : void 0;
	if (!r || !n || r.length != n.length) return !1;
	let i;
	for (let o = 0; o < r.length; o++)
		if (((i = r[o]), !kh(t[i], e[i]))) return !1;
	return !0;
}
function Iu(t) {
	return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function kh(t, e) {
	if (Array.isArray(t) && Array.isArray(e)) {
		if (t.length !== e.length) return !1;
		let r = [...t].sort(),
			n = [...e].sort();
		return r.every((i, o) => n[o] === i);
	} else return t === e;
}
function Lh(t) {
	return t.length > 0 ? t[t.length - 1] : null;
}
function vt(t) {
	return rs(t) ? t : Rt(t) ? $(Promise.resolve(t)) : M(t);
}
var jw = { exact: jh, subset: $h },
	Vh = { exact: $w, subset: Uw, ignored: () => !0 };
function Nh(t, e, r) {
	return (
		jw[r.paths](t.root, e.root, r.matrixParams) &&
		Vh[r.queryParams](t.queryParams, e.queryParams) &&
		!(r.fragment === "exact" && t.fragment !== e.fragment)
	);
}
function $w(t, e) {
	return $e(t, e);
}
function jh(t, e, r) {
	if (
		!Lt(t.segments, e.segments) ||
		!Mo(t.segments, e.segments, r) ||
		t.numberOfChildren !== e.numberOfChildren
	)
		return !1;
	for (let n in e.children)
		if (!t.children[n] || !jh(t.children[n], e.children[n], r)) return !1;
	return !0;
}
function Uw(t, e) {
	return (
		Object.keys(e).length <= Object.keys(t).length &&
		Object.keys(e).every((r) => kh(t[r], e[r]))
	);
}
function $h(t, e, r) {
	return Uh(t, e, e.segments, r);
}
function Uh(t, e, r, n) {
	if (t.segments.length > r.length) {
		let i = t.segments.slice(0, r.length);
		return !(!Lt(i, r) || e.hasChildren() || !Mo(i, r, n));
	} else if (t.segments.length === r.length) {
		if (!Lt(t.segments, r) || !Mo(t.segments, r, n)) return !1;
		for (let i in e.children)
			if (!t.children[i] || !$h(t.children[i], e.children[i], n))
				return !1;
		return !0;
	} else {
		let i = r.slice(0, t.segments.length),
			o = r.slice(t.segments.length);
		return !Lt(t.segments, i) || !Mo(t.segments, i, n) || !t.children[S]
			? !1
			: Uh(t.children[S], e, o, n);
	}
}
function Mo(t, e, r) {
	return e.every((n, i) => Vh[r](t[i].parameters, n.parameters));
}
var gt = class {
		constructor(e = new P([], {}), r = {}, n = null) {
			(this.root = e), (this.queryParams = r), (this.fragment = n);
		}
		get queryParamMap() {
			return (
				this._queryParamMap ||
					(this._queryParamMap = An(this.queryParams)),
				this._queryParamMap
			);
		}
		toString() {
			return zw.serialize(this);
		}
	},
	P = class {
		constructor(e, r) {
			(this.segments = e),
				(this.children = r),
				(this.parent = null),
				Object.values(r).forEach((n) => (n.parent = this));
		}
		hasChildren() {
			return this.numberOfChildren > 0;
		}
		get numberOfChildren() {
			return Object.keys(this.children).length;
		}
		toString() {
			return _o(this);
		}
	},
	kt = class {
		constructor(e, r) {
			(this.path = e), (this.parameters = r);
		}
		get parameterMap() {
			return (
				this._parameterMap ||
					(this._parameterMap = An(this.parameters)),
				this._parameterMap
			);
		}
		toString() {
			return Hh(this);
		}
	};
function Bw(t, e) {
	return Lt(t, e) && t.every((r, n) => $e(r.parameters, e[n].parameters));
}
function Lt(t, e) {
	return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function Hw(t, e) {
	let r = [];
	return (
		Object.entries(t.children).forEach(([n, i]) => {
			n === S && (r = r.concat(e(i, n)));
		}),
		Object.entries(t.children).forEach(([n, i]) => {
			n !== S && (r = r.concat(e(i, n)));
		}),
		r
	);
}
var Zu = (() => {
		let e = class e {};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({
				token: e,
				factory: () => (() => new To())(),
				providedIn: "root",
			}));
		let t = e;
		return t;
	})(),
	To = class {
		parse(e) {
			let r = new Mu(e);
			return new gt(
				r.parseRootSegment(),
				r.parseQueryParams(),
				r.parseFragment(),
			);
		}
		serialize(e) {
			let r = `/${Dr(e.root, !0)}`,
				n = qw(e.queryParams),
				i = typeof e.fragment == "string" ? `#${Gw(e.fragment)}` : "";
			return `${r}${n}${i}`;
		}
	},
	zw = new To();
function _o(t) {
	return t.segments.map((e) => Hh(e)).join("/");
}
function Dr(t, e) {
	if (!t.hasChildren()) return _o(t);
	if (e) {
		let r = t.children[S] ? Dr(t.children[S], !1) : "",
			n = [];
		return (
			Object.entries(t.children).forEach(([i, o]) => {
				i !== S && n.push(`${i}:${Dr(o, !1)}`);
			}),
			n.length > 0 ? `${r}(${n.join("//")})` : r
		);
	} else {
		let r = Hw(t, (n, i) =>
			i === S ? [Dr(t.children[S], !1)] : [`${i}:${Dr(n, !1)}`],
		);
		return Object.keys(t.children).length === 1 && t.children[S] != null
			? `${_o(t)}/${r[0]}`
			: `${_o(t)}/(${r.join("//")})`;
	}
}
function Bh(t) {
	return encodeURIComponent(t)
		.replace(/%40/g, "@")
		.replace(/%3A/gi, ":")
		.replace(/%24/g, "$")
		.replace(/%2C/gi, ",");
}
function Io(t) {
	return Bh(t).replace(/%3B/gi, ";");
}
function Gw(t) {
	return encodeURI(t);
}
function bu(t) {
	return Bh(t)
		.replace(/\(/g, "%28")
		.replace(/\)/g, "%29")
		.replace(/%26/gi, "&");
}
function So(t) {
	return decodeURIComponent(t);
}
function Oh(t) {
	return So(t.replace(/\+/g, "%20"));
}
function Hh(t) {
	return `${bu(t.path)}${Ww(t.parameters)}`;
}
function Ww(t) {
	return Object.keys(t)
		.map((e) => `;${bu(e)}=${bu(t[e])}`)
		.join("");
}
function qw(t) {
	let e = Object.keys(t)
		.map((r) => {
			let n = t[r];
			return Array.isArray(n)
				? n.map((i) => `${Io(r)}=${Io(i)}`).join("&")
				: `${Io(r)}=${Io(n)}`;
		})
		.filter((r) => !!r);
	return e.length ? `?${e.join("&")}` : "";
}
var Zw = /^[^\/()?;#]+/;
function yu(t) {
	let e = t.match(Zw);
	return e ? e[0] : "";
}
var Yw = /^[^\/()?;=#]+/;
function Qw(t) {
	let e = t.match(Yw);
	return e ? e[0] : "";
}
var Kw = /^[^=?&#]+/;
function Jw(t) {
	let e = t.match(Kw);
	return e ? e[0] : "";
}
var Xw = /^[^&#]+/;
function eE(t) {
	let e = t.match(Xw);
	return e ? e[0] : "";
}
var Mu = class {
	constructor(e) {
		(this.url = e), (this.remaining = e);
	}
	parseRootSegment() {
		return (
			this.consumeOptional("/"),
			this.remaining === "" ||
			this.peekStartsWith("?") ||
			this.peekStartsWith("#")
				? new P([], {})
				: new P([], this.parseChildren())
		);
	}
	parseQueryParams() {
		let e = {};
		if (this.consumeOptional("?"))
			do this.parseQueryParam(e);
			while (this.consumeOptional("&"));
		return e;
	}
	parseFragment() {
		return this.consumeOptional("#")
			? decodeURIComponent(this.remaining)
			: null;
	}
	parseChildren() {
		if (this.remaining === "") return {};
		this.consumeOptional("/");
		let e = [];
		for (
			this.peekStartsWith("(") || e.push(this.parseSegment());
			this.peekStartsWith("/") &&
			!this.peekStartsWith("//") &&
			!this.peekStartsWith("/(");

		)
			this.capture("/"), e.push(this.parseSegment());
		let r = {};
		this.peekStartsWith("/(") &&
			(this.capture("/"), (r = this.parseParens(!0)));
		let n = {};
		return (
			this.peekStartsWith("(") && (n = this.parseParens(!1)),
			(e.length > 0 || Object.keys(r).length > 0) && (n[S] = new P(e, r)),
			n
		);
	}
	parseSegment() {
		let e = yu(this.remaining);
		if (e === "" && this.peekStartsWith(";")) throw new C(4009, !1);
		return this.capture(e), new kt(So(e), this.parseMatrixParams());
	}
	parseMatrixParams() {
		let e = {};
		for (; this.consumeOptional(";"); ) this.parseParam(e);
		return e;
	}
	parseParam(e) {
		let r = Qw(this.remaining);
		if (!r) return;
		this.capture(r);
		let n = "";
		if (this.consumeOptional("=")) {
			let i = yu(this.remaining);
			i && ((n = i), this.capture(n));
		}
		e[So(r)] = So(n);
	}
	parseQueryParam(e) {
		let r = Jw(this.remaining);
		if (!r) return;
		this.capture(r);
		let n = "";
		if (this.consumeOptional("=")) {
			let s = eE(this.remaining);
			s && ((n = s), this.capture(n));
		}
		let i = Oh(r),
			o = Oh(n);
		if (e.hasOwnProperty(i)) {
			let s = e[i];
			Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
		} else e[i] = o;
	}
	parseParens(e) {
		let r = {};
		for (
			this.capture("(");
			!this.consumeOptional(")") && this.remaining.length > 0;

		) {
			let n = yu(this.remaining),
				i = this.remaining[n.length];
			if (i !== "/" && i !== ")" && i !== ";") throw new C(4010, !1);
			let o;
			n.indexOf(":") > -1
				? ((o = n.slice(0, n.indexOf(":"))),
					this.capture(o),
					this.capture(":"))
				: e && (o = S);
			let s = this.parseChildren();
			(r[o] = Object.keys(s).length === 1 ? s[S] : new P([], s)),
				this.consumeOptional("//");
		}
		return r;
	}
	peekStartsWith(e) {
		return this.remaining.startsWith(e);
	}
	consumeOptional(e) {
		return this.peekStartsWith(e)
			? ((this.remaining = this.remaining.substring(e.length)), !0)
			: !1;
	}
	capture(e) {
		if (!this.consumeOptional(e)) throw new C(4011, !1);
	}
};
function zh(t) {
	return t.segments.length > 0 ? new P([], { [S]: t }) : t;
}
function Gh(t) {
	let e = {};
	for (let n of Object.keys(t.children)) {
		let i = t.children[n],
			o = Gh(i);
		if (n === S && o.segments.length === 0 && o.hasChildren())
			for (let [s, a] of Object.entries(o.children)) e[s] = a;
		else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
	}
	let r = new P(t.segments, e);
	return tE(r);
}
function tE(t) {
	if (t.numberOfChildren === 1 && t.children[S]) {
		let e = t.children[S];
		return new P(t.segments.concat(e.segments), e.children);
	}
	return t;
}
function Nn(t) {
	return t instanceof gt;
}
function nE(t, e, r = null, n = null) {
	let i = Wh(t);
	return qh(i, e, r, n);
}
function Wh(t) {
	let e;
	function r(o) {
		let s = {};
		for (let u of o.children) {
			let c = r(u);
			s[u.outlet] = c;
		}
		let a = new P(o.url, s);
		return o === t && (e = a), a;
	}
	let n = r(t.root),
		i = zh(n);
	return e ?? i;
}
function qh(t, e, r, n) {
	let i = t;
	for (; i.parent; ) i = i.parent;
	if (e.length === 0) return Du(i, i, i, r, n);
	let o = rE(e);
	if (o.toRoot()) return Du(i, i, new P([], {}), r, n);
	let s = iE(o, i, t),
		a = s.processChildren
			? Er(s.segmentGroup, s.index, o.commands)
			: Yh(s.segmentGroup, s.index, o.commands);
	return Du(i, s.segmentGroup, a, r, n);
}
function xo(t) {
	return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function Mr(t) {
	return typeof t == "object" && t != null && t.outlets;
}
function Du(t, e, r, n, i) {
	let o = {};
	n &&
		Object.entries(n).forEach(([u, c]) => {
			o[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
		});
	let s;
	t === e ? (s = r) : (s = Zh(t, e, r));
	let a = zh(Gh(s));
	return new gt(a, o, i);
}
function Zh(t, e, r) {
	let n = {};
	return (
		Object.entries(t.children).forEach(([i, o]) => {
			o === e ? (n[i] = r) : (n[i] = Zh(o, e, r));
		}),
		new P(t.segments, n)
	);
}
var Ao = class {
	constructor(e, r, n) {
		if (
			((this.isAbsolute = e),
			(this.numberOfDoubleDots = r),
			(this.commands = n),
			e && n.length > 0 && xo(n[0]))
		)
			throw new C(4003, !1);
		let i = n.find(Mr);
		if (i && i !== Lh(n)) throw new C(4004, !1);
	}
	toRoot() {
		return (
			this.isAbsolute &&
			this.commands.length === 1 &&
			this.commands[0] == "/"
		);
	}
};
function rE(t) {
	if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
		return new Ao(!0, 0, t);
	let e = 0,
		r = !1,
		n = t.reduce((i, o, s) => {
			if (typeof o == "object" && o != null) {
				if (o.outlets) {
					let a = {};
					return (
						Object.entries(o.outlets).forEach(([u, c]) => {
							a[u] = typeof c == "string" ? c.split("/") : c;
						}),
						[...i, { outlets: a }]
					);
				}
				if (o.segmentPath) return [...i, o.segmentPath];
			}
			return typeof o != "string"
				? [...i, o]
				: s === 0
					? (o.split("/").forEach((a, u) => {
							(u == 0 && a === ".") ||
								(u == 0 && a === ""
									? (r = !0)
									: a === ".."
										? e++
										: a != "" && i.push(a));
						}),
						i)
					: [...i, o];
		}, []);
	return new Ao(r, e, n);
}
var Tn = class {
	constructor(e, r, n) {
		(this.segmentGroup = e), (this.processChildren = r), (this.index = n);
	}
};
function iE(t, e, r) {
	if (t.isAbsolute) return new Tn(e, !0, 0);
	if (!r) return new Tn(e, !1, NaN);
	if (r.parent === null) return new Tn(r, !0, 0);
	let n = xo(t.commands[0]) ? 0 : 1,
		i = r.segments.length - 1 + n;
	return oE(r, i, t.numberOfDoubleDots);
}
function oE(t, e, r) {
	let n = t,
		i = e,
		o = r;
	for (; o > i; ) {
		if (((o -= i), (n = n.parent), !n)) throw new C(4005, !1);
		i = n.segments.length;
	}
	return new Tn(n, !1, i - o);
}
function sE(t) {
	return Mr(t[0]) ? t[0].outlets : { [S]: t };
}
function Yh(t, e, r) {
	if ((t || (t = new P([], {})), t.segments.length === 0 && t.hasChildren()))
		return Er(t, e, r);
	let n = aE(t, e, r),
		i = r.slice(n.commandIndex);
	if (n.match && n.pathIndex < t.segments.length) {
		let o = new P(t.segments.slice(0, n.pathIndex), {});
		return (
			(o.children[S] = new P(t.segments.slice(n.pathIndex), t.children)),
			Er(o, 0, i)
		);
	} else
		return n.match && i.length === 0
			? new P(t.segments, {})
			: n.match && !t.hasChildren()
				? _u(t, e, r)
				: n.match
					? Er(t, 0, i)
					: _u(t, e, r);
}
function Er(t, e, r) {
	if (r.length === 0) return new P(t.segments, {});
	{
		let n = sE(r),
			i = {};
		if (
			Object.keys(n).some((o) => o !== S) &&
			t.children[S] &&
			t.numberOfChildren === 1 &&
			t.children[S].segments.length === 0
		) {
			let o = Er(t.children[S], e, r);
			return new P(t.segments, o.children);
		}
		return (
			Object.entries(n).forEach(([o, s]) => {
				typeof s == "string" && (s = [s]),
					s !== null && (i[o] = Yh(t.children[o], e, s));
			}),
			Object.entries(t.children).forEach(([o, s]) => {
				n[o] === void 0 && (i[o] = s);
			}),
			new P(t.segments, i)
		);
	}
}
function aE(t, e, r) {
	let n = 0,
		i = e,
		o = { match: !1, pathIndex: 0, commandIndex: 0 };
	for (; i < t.segments.length; ) {
		if (n >= r.length) return o;
		let s = t.segments[i],
			a = r[n];
		if (Mr(a)) break;
		let u = `${a}`,
			c = n < r.length - 1 ? r[n + 1] : null;
		if (i > 0 && u === void 0) break;
		if (u && c && typeof c == "object" && c.outlets === void 0) {
			if (!Fh(u, c, s)) return o;
			n += 2;
		} else {
			if (!Fh(u, {}, s)) return o;
			n++;
		}
		i++;
	}
	return { match: !0, pathIndex: i, commandIndex: n };
}
function _u(t, e, r) {
	let n = t.segments.slice(0, e),
		i = 0;
	for (; i < r.length; ) {
		let o = r[i];
		if (Mr(o)) {
			let u = uE(o.outlets);
			return new P(n, u);
		}
		if (i === 0 && xo(r[0])) {
			let u = t.segments[e];
			n.push(new kt(u.path, Rh(r[0]))), i++;
			continue;
		}
		let s = Mr(o) ? o.outlets[S] : `${o}`,
			a = i < r.length - 1 ? r[i + 1] : null;
		s && a && xo(a)
			? (n.push(new kt(s, Rh(a))), (i += 2))
			: (n.push(new kt(s, {})), i++);
	}
	return new P(n, {});
}
function uE(t) {
	let e = {};
	return (
		Object.entries(t).forEach(([r, n]) => {
			typeof n == "string" && (n = [n]),
				n !== null && (e[r] = _u(new P([], {}), 0, n));
		}),
		e
	);
}
function Rh(t) {
	let e = {};
	return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function Fh(t, e, r) {
	return t == r.path && $e(e, r.parameters);
}
var Ir = "imperative",
	Ie = class {
		constructor(e, r) {
			(this.id = e), (this.url = r);
		}
	},
	_r = class extends Ie {
		constructor(e, r, n = "imperative", i = null) {
			super(e, r),
				(this.type = 0),
				(this.navigationTrigger = n),
				(this.restoredState = i);
		}
		toString() {
			return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
		}
	},
	Vt = class extends Ie {
		constructor(e, r, n) {
			super(e, r), (this.urlAfterRedirects = n), (this.type = 1);
		}
		toString() {
			return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
		}
	},
	mt = class extends Ie {
		constructor(e, r, n, i) {
			super(e, r), (this.reason = n), (this.code = i), (this.type = 2);
		}
		toString() {
			return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
		}
	},
	jt = class extends Ie {
		constructor(e, r, n, i) {
			super(e, r), (this.reason = n), (this.code = i), (this.type = 16);
		}
	},
	Sr = class extends Ie {
		constructor(e, r, n, i) {
			super(e, r), (this.error = n), (this.target = i), (this.type = 3);
		}
		toString() {
			return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
		}
	},
	No = class extends Ie {
		constructor(e, r, n, i) {
			super(e, r),
				(this.urlAfterRedirects = n),
				(this.state = i),
				(this.type = 4);
		}
		toString() {
			return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	Su = class extends Ie {
		constructor(e, r, n, i) {
			super(e, r),
				(this.urlAfterRedirects = n),
				(this.state = i),
				(this.type = 7);
		}
		toString() {
			return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	Tu = class extends Ie {
		constructor(e, r, n, i, o) {
			super(e, r),
				(this.urlAfterRedirects = n),
				(this.state = i),
				(this.shouldActivate = o),
				(this.type = 8);
		}
		toString() {
			return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
		}
	},
	xu = class extends Ie {
		constructor(e, r, n, i) {
			super(e, r),
				(this.urlAfterRedirects = n),
				(this.state = i),
				(this.type = 5);
		}
		toString() {
			return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	Au = class extends Ie {
		constructor(e, r, n, i) {
			super(e, r),
				(this.urlAfterRedirects = n),
				(this.state = i),
				(this.type = 6);
		}
		toString() {
			return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	Nu = class {
		constructor(e) {
			(this.route = e), (this.type = 9);
		}
		toString() {
			return `RouteConfigLoadStart(path: ${this.route.path})`;
		}
	},
	Ou = class {
		constructor(e) {
			(this.route = e), (this.type = 10);
		}
		toString() {
			return `RouteConfigLoadEnd(path: ${this.route.path})`;
		}
	},
	Ru = class {
		constructor(e) {
			(this.snapshot = e), (this.type = 11);
		}
		toString() {
			return `ChildActivationStart(path: '${
				(this.snapshot.routeConfig && this.snapshot.routeConfig.path) ||
				""
			}')`;
		}
	},
	Fu = class {
		constructor(e) {
			(this.snapshot = e), (this.type = 12);
		}
		toString() {
			return `ChildActivationEnd(path: '${
				(this.snapshot.routeConfig && this.snapshot.routeConfig.path) ||
				""
			}')`;
		}
	},
	Pu = class {
		constructor(e) {
			(this.snapshot = e), (this.type = 13);
		}
		toString() {
			return `ActivationStart(path: '${
				(this.snapshot.routeConfig && this.snapshot.routeConfig.path) ||
				""
			}')`;
		}
	},
	ku = class {
		constructor(e) {
			(this.snapshot = e), (this.type = 14);
		}
		toString() {
			return `ActivationEnd(path: '${
				(this.snapshot.routeConfig && this.snapshot.routeConfig.path) ||
				""
			}')`;
		}
	};
var Tr = class {},
	xr = class {
		constructor(e) {
			this.url = e;
		}
	};
var Lu = class {
		constructor() {
			(this.outlet = null),
				(this.route = null),
				(this.injector = null),
				(this.children = new Lo()),
				(this.attachRef = null);
		}
	},
	Lo = (() => {
		let e = class e {
			constructor() {
				this.contexts = new Map();
			}
			onChildOutletCreated(n, i) {
				let o = this.getOrCreateContext(n);
				(o.outlet = i), this.contexts.set(n, o);
			}
			onChildOutletDestroyed(n) {
				let i = this.getContext(n);
				i && ((i.outlet = null), (i.attachRef = null));
			}
			onOutletDeactivated() {
				let n = this.contexts;
				return (this.contexts = new Map()), n;
			}
			onOutletReAttached(n) {
				this.contexts = n;
			}
			getOrCreateContext(n) {
				let i = this.getContext(n);
				return i || ((i = new Lu()), this.contexts.set(n, i)), i;
			}
			getContext(n) {
				return this.contexts.get(n) || null;
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})(),
	Oo = class {
		constructor(e) {
			this._root = e;
		}
		get root() {
			return this._root.value;
		}
		parent(e) {
			let r = this.pathFromRoot(e);
			return r.length > 1 ? r[r.length - 2] : null;
		}
		children(e) {
			let r = Vu(e, this._root);
			return r ? r.children.map((n) => n.value) : [];
		}
		firstChild(e) {
			let r = Vu(e, this._root);
			return r && r.children.length > 0 ? r.children[0].value : null;
		}
		siblings(e) {
			let r = ju(e, this._root);
			return r.length < 2
				? []
				: r[r.length - 2].children
						.map((i) => i.value)
						.filter((i) => i !== e);
		}
		pathFromRoot(e) {
			return ju(e, this._root).map((r) => r.value);
		}
	};
function Vu(t, e) {
	if (t === e.value) return e;
	for (let r of e.children) {
		let n = Vu(t, r);
		if (n) return n;
	}
	return null;
}
function ju(t, e) {
	if (t === e.value) return [e];
	for (let r of e.children) {
		let n = ju(t, r);
		if (n.length) return n.unshift(e), n;
	}
	return [];
}
var ge = class {
	constructor(e, r) {
		(this.value = e), (this.children = r);
	}
	toString() {
		return `TreeNode(${this.value})`;
	}
};
function Sn(t) {
	let e = {};
	return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var Ro = class extends Oo {
	constructor(e, r) {
		super(e), (this.snapshot = r), Qu(this, e);
	}
	toString() {
		return this.snapshot.toString();
	}
};
function Qh(t, e) {
	let r = cE(t, e),
		n = new Q([new kt("", {})]),
		i = new Q({}),
		o = new Q({}),
		s = new Q({}),
		a = new Q(""),
		u = new On(n, i, s, a, o, S, e, r.root);
	return (u.snapshot = r.root), new Ro(new ge(u, []), r);
}
function cE(t, e) {
	let r = {},
		n = {},
		i = {},
		o = "",
		s = new Ar([], r, i, o, n, S, e, null, {});
	return new Fo("", new ge(s, []));
}
var On = class {
	constructor(e, r, n, i, o, s, a, u) {
		(this.urlSubject = e),
			(this.paramsSubject = r),
			(this.queryParamsSubject = n),
			(this.fragmentSubject = i),
			(this.dataSubject = o),
			(this.outlet = s),
			(this.component = a),
			(this._futureSnapshot = u),
			(this.title = this.dataSubject?.pipe(E((c) => c[Rr])) ?? M(void 0)),
			(this.url = e),
			(this.params = r),
			(this.queryParams = n),
			(this.fragment = i),
			(this.data = o);
	}
	get routeConfig() {
		return this._futureSnapshot.routeConfig;
	}
	get root() {
		return this._routerState.root;
	}
	get parent() {
		return this._routerState.parent(this);
	}
	get firstChild() {
		return this._routerState.firstChild(this);
	}
	get children() {
		return this._routerState.children(this);
	}
	get pathFromRoot() {
		return this._routerState.pathFromRoot(this);
	}
	get paramMap() {
		return (
			this._paramMap ||
				(this._paramMap = this.params.pipe(E((e) => An(e)))),
			this._paramMap
		);
	}
	get queryParamMap() {
		return (
			this._queryParamMap ||
				(this._queryParamMap = this.queryParams.pipe(E((e) => An(e)))),
			this._queryParamMap
		);
	}
	toString() {
		return this.snapshot
			? this.snapshot.toString()
			: `Future(${this._futureSnapshot})`;
	}
};
function Yu(t, e, r = "emptyOnly") {
	let n,
		{ routeConfig: i } = t;
	return (
		e !== null &&
		(r === "always" ||
			i?.path === "" ||
			(!e.component && !e.routeConfig?.loadComponent))
			? (n = {
					params: m(m({}, e.params), t.params),
					data: m(m({}, e.data), t.data),
					resolve: m(
						m(m(m({}, t.data), e.data), i?.data),
						t._resolvedData,
					),
				})
			: (n = {
					params: m({}, t.params),
					data: m({}, t.data),
					resolve: m(m({}, t.data), t._resolvedData ?? {}),
				}),
		i && Jh(i) && (n.resolve[Rr] = i.title),
		n
	);
}
var Ar = class {
		get title() {
			return this.data?.[Rr];
		}
		constructor(e, r, n, i, o, s, a, u, c) {
			(this.url = e),
				(this.params = r),
				(this.queryParams = n),
				(this.fragment = i),
				(this.data = o),
				(this.outlet = s),
				(this.component = a),
				(this.routeConfig = u),
				(this._resolve = c);
		}
		get root() {
			return this._routerState.root;
		}
		get parent() {
			return this._routerState.parent(this);
		}
		get firstChild() {
			return this._routerState.firstChild(this);
		}
		get children() {
			return this._routerState.children(this);
		}
		get pathFromRoot() {
			return this._routerState.pathFromRoot(this);
		}
		get paramMap() {
			return (
				this._paramMap || (this._paramMap = An(this.params)),
				this._paramMap
			);
		}
		get queryParamMap() {
			return (
				this._queryParamMap ||
					(this._queryParamMap = An(this.queryParams)),
				this._queryParamMap
			);
		}
		toString() {
			let e = this.url.map((n) => n.toString()).join("/"),
				r = this.routeConfig ? this.routeConfig.path : "";
			return `Route(url:'${e}', path:'${r}')`;
		}
	},
	Fo = class extends Oo {
		constructor(e, r) {
			super(r), (this.url = e), Qu(this, r);
		}
		toString() {
			return Kh(this._root);
		}
	};
function Qu(t, e) {
	(e.value._routerState = t), e.children.forEach((r) => Qu(t, r));
}
function Kh(t) {
	let e =
		t.children.length > 0 ? ` { ${t.children.map(Kh).join(", ")} } ` : "";
	return `${t.value}${e}`;
}
function Cu(t) {
	if (t.snapshot) {
		let e = t.snapshot,
			r = t._futureSnapshot;
		(t.snapshot = r),
			$e(e.queryParams, r.queryParams) ||
				t.queryParamsSubject.next(r.queryParams),
			e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
			$e(e.params, r.params) || t.paramsSubject.next(r.params),
			Vw(e.url, r.url) || t.urlSubject.next(r.url),
			$e(e.data, r.data) || t.dataSubject.next(r.data);
	} else
		(t.snapshot = t._futureSnapshot),
			t.dataSubject.next(t._futureSnapshot.data);
}
function $u(t, e) {
	let r = $e(t.params, e.params) && Bw(t.url, e.url),
		n = !t.parent != !e.parent;
	return r && !n && (!t.parent || $u(t.parent, e.parent));
}
function Jh(t) {
	return typeof t.title == "string" || t.title === null;
}
var Ku = (() => {
		let e = class e {
			constructor() {
				(this.activated = null),
					(this._activatedRoute = null),
					(this.name = S),
					(this.activateEvents = new X()),
					(this.deactivateEvents = new X()),
					(this.attachEvents = new X()),
					(this.detachEvents = new X()),
					(this.parentContexts = p(Lo)),
					(this.location = p(vn)),
					(this.changeDetector = p(pn)),
					(this.environmentInjector = p(re)),
					(this.inputBinder = p(Ju, { optional: !0 })),
					(this.supportsBindingToComponentInputs = !0);
			}
			get activatedComponentRef() {
				return this.activated;
			}
			ngOnChanges(n) {
				if (n.name) {
					let { firstChange: i, previousValue: o } = n.name;
					if (i) return;
					this.isTrackedInParentContexts(o) &&
						(this.deactivate(),
						this.parentContexts.onChildOutletDestroyed(o)),
						this.initializeOutletWithName();
				}
			}
			ngOnDestroy() {
				this.isTrackedInParentContexts(this.name) &&
					this.parentContexts.onChildOutletDestroyed(this.name),
					this.inputBinder?.unsubscribeFromRouteData(this);
			}
			isTrackedInParentContexts(n) {
				return this.parentContexts.getContext(n)?.outlet === this;
			}
			ngOnInit() {
				this.initializeOutletWithName();
			}
			initializeOutletWithName() {
				if (
					(this.parentContexts.onChildOutletCreated(this.name, this),
					this.activated)
				)
					return;
				let n = this.parentContexts.getContext(this.name);
				n?.route &&
					(n.attachRef
						? this.attach(n.attachRef, n.route)
						: this.activateWith(n.route, n.injector));
			}
			get isActivated() {
				return !!this.activated;
			}
			get component() {
				if (!this.activated) throw new C(4012, !1);
				return this.activated.instance;
			}
			get activatedRoute() {
				if (!this.activated) throw new C(4012, !1);
				return this._activatedRoute;
			}
			get activatedRouteData() {
				return this._activatedRoute
					? this._activatedRoute.snapshot.data
					: {};
			}
			detach() {
				if (!this.activated) throw new C(4012, !1);
				this.location.detach();
				let n = this.activated;
				return (
					(this.activated = null),
					(this._activatedRoute = null),
					this.detachEvents.emit(n.instance),
					n
				);
			}
			attach(n, i) {
				(this.activated = n),
					(this._activatedRoute = i),
					this.location.insert(n.hostView),
					this.inputBinder?.bindActivatedRouteToOutletComponent(this),
					this.attachEvents.emit(n.instance);
			}
			deactivate() {
				if (this.activated) {
					let n = this.component;
					this.activated.destroy(),
						(this.activated = null),
						(this._activatedRoute = null),
						this.deactivateEvents.emit(n);
				}
			}
			activateWith(n, i) {
				if (this.isActivated) throw new C(4013, !1);
				this._activatedRoute = n;
				let o = this.location,
					a = n.snapshot.component,
					u = this.parentContexts.getOrCreateContext(
						this.name,
					).children,
					c = new Uu(n, u, o.injector);
				(this.activated = o.createComponent(a, {
					index: o.length,
					injector: c,
					environmentInjector: i ?? this.environmentInjector,
				})),
					this.changeDetector.markForCheck(),
					this.inputBinder?.bindActivatedRouteToOutletComponent(this),
					this.activateEvents.emit(this.activated.instance);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵdir = Ae({
				type: e,
				selectors: [["router-outlet"]],
				inputs: { name: "name" },
				outputs: {
					activateEvents: "activate",
					deactivateEvents: "deactivate",
					attachEvents: "attach",
					detachEvents: "detach",
				},
				exportAs: ["outlet"],
				standalone: !0,
				features: [ln],
			}));
		let t = e;
		return t;
	})(),
	Uu = class {
		constructor(e, r, n) {
			(this.route = e), (this.childContexts = r), (this.parent = n);
		}
		get(e, r) {
			return e === On
				? this.route
				: e === Lo
					? this.childContexts
					: this.parent.get(e, r);
		}
	},
	Ju = new w("");
function lE(t, e, r) {
	let n = Nr(t, e._root, r ? r._root : void 0);
	return new Ro(n, e);
}
function Nr(t, e, r) {
	if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
		let n = r.value;
		n._futureSnapshot = e.value;
		let i = dE(t, e, r);
		return new ge(n, i);
	} else {
		if (t.shouldAttach(e.value)) {
			let o = t.retrieve(e.value);
			if (o !== null) {
				let s = o.route;
				return (
					(s.value._futureSnapshot = e.value),
					(s.children = e.children.map((a) => Nr(t, a))),
					s
				);
			}
		}
		let n = fE(e.value),
			i = e.children.map((o) => Nr(t, o));
		return new ge(n, i);
	}
}
function dE(t, e, r) {
	return e.children.map((n) => {
		for (let i of r.children)
			if (t.shouldReuseRoute(n.value, i.value.snapshot))
				return Nr(t, n, i);
		return Nr(t, n);
	});
}
function fE(t) {
	return new On(
		new Q(t.url),
		new Q(t.params),
		new Q(t.queryParams),
		new Q(t.fragment),
		new Q(t.data),
		t.outlet,
		t.component,
		t,
	);
}
var Xh = "ngNavigationCancelingError";
function ep(t, e) {
	let { redirectTo: r, navigationBehaviorOptions: n } = Nn(e)
			? { redirectTo: e, navigationBehaviorOptions: void 0 }
			: e,
		i = tp(!1, 0, e);
	return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function tp(t, e, r) {
	let n = new Error("NavigationCancelingError: " + (t || ""));
	return (n[Xh] = !0), (n.cancellationCode = e), r && (n.url = r), n;
}
function hE(t) {
	return np(t) && Nn(t.url);
}
function np(t) {
	return t && t[Xh];
}
var pE = (() => {
	let e = class e {};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵcmp = un({
			type: e,
			selectors: [["ng-component"]],
			standalone: !0,
			features: [Cn],
			decls: 1,
			vars: 0,
			template: function (i, o) {
				i & 1 && yn(0, "router-outlet");
			},
			dependencies: [Ku],
			encapsulation: 2,
		}));
	let t = e;
	return t;
})();
function gE(t, e) {
	return (
		t.providers &&
			!t._injector &&
			(t._injector = Qa(t.providers, e, `Route: ${t.path}`)),
		t._injector ?? e
	);
}
function Xu(t) {
	let e = t.children && t.children.map(Xu),
		r = e ? j(m({}, t), { children: e }) : m({}, t);
	return (
		!r.component &&
			!r.loadComponent &&
			(e || r.loadChildren) &&
			r.outlet &&
			r.outlet !== S &&
			(r.component = pE),
		r
	);
}
function Ue(t) {
	return t.outlet || S;
}
function mE(t, e) {
	let r = t.filter((n) => Ue(n) === e);
	return r.push(...t.filter((n) => Ue(n) !== e)), r;
}
function Fr(t) {
	if (!t) return null;
	if (t.routeConfig?._injector) return t.routeConfig._injector;
	for (let e = t.parent; e; e = e.parent) {
		let r = e.routeConfig;
		if (r?._loadedInjector) return r._loadedInjector;
		if (r?._injector) return r._injector;
	}
	return null;
}
var vE = (t, e, r, n) =>
		E(
			(i) => (
				new Bu(
					e,
					i.targetRouterState,
					i.currentRouterState,
					r,
					n,
				).activate(t),
				i
			),
		),
	Bu = class {
		constructor(e, r, n, i, o) {
			(this.routeReuseStrategy = e),
				(this.futureState = r),
				(this.currState = n),
				(this.forwardEvent = i),
				(this.inputBindingEnabled = o);
		}
		activate(e) {
			let r = this.futureState._root,
				n = this.currState ? this.currState._root : null;
			this.deactivateChildRoutes(r, n, e),
				Cu(this.futureState.root),
				this.activateChildRoutes(r, n, e);
		}
		deactivateChildRoutes(e, r, n) {
			let i = Sn(r);
			e.children.forEach((o) => {
				let s = o.value.outlet;
				this.deactivateRoutes(o, i[s], n), delete i[s];
			}),
				Object.values(i).forEach((o) => {
					this.deactivateRouteAndItsChildren(o, n);
				});
		}
		deactivateRoutes(e, r, n) {
			let i = e.value,
				o = r ? r.value : null;
			if (i === o)
				if (i.component) {
					let s = n.getContext(i.outlet);
					s && this.deactivateChildRoutes(e, r, s.children);
				} else this.deactivateChildRoutes(e, r, n);
			else o && this.deactivateRouteAndItsChildren(r, n);
		}
		deactivateRouteAndItsChildren(e, r) {
			e.value.component &&
			this.routeReuseStrategy.shouldDetach(e.value.snapshot)
				? this.detachAndStoreRouteSubtree(e, r)
				: this.deactivateRouteAndOutlet(e, r);
		}
		detachAndStoreRouteSubtree(e, r) {
			let n = r.getContext(e.value.outlet),
				i = n && e.value.component ? n.children : r,
				o = Sn(e);
			for (let s of Object.keys(o))
				this.deactivateRouteAndItsChildren(o[s], i);
			if (n && n.outlet) {
				let s = n.outlet.detach(),
					a = n.children.onOutletDeactivated();
				this.routeReuseStrategy.store(e.value.snapshot, {
					componentRef: s,
					route: e,
					contexts: a,
				});
			}
		}
		deactivateRouteAndOutlet(e, r) {
			let n = r.getContext(e.value.outlet),
				i = n && e.value.component ? n.children : r,
				o = Sn(e);
			for (let s of Object.keys(o))
				this.deactivateRouteAndItsChildren(o[s], i);
			n &&
				(n.outlet &&
					(n.outlet.deactivate(), n.children.onOutletDeactivated()),
				(n.attachRef = null),
				(n.route = null));
		}
		activateChildRoutes(e, r, n) {
			let i = Sn(r);
			e.children.forEach((o) => {
				this.activateRoutes(o, i[o.value.outlet], n),
					this.forwardEvent(new ku(o.value.snapshot));
			}),
				e.children.length &&
					this.forwardEvent(new Fu(e.value.snapshot));
		}
		activateRoutes(e, r, n) {
			let i = e.value,
				o = r ? r.value : null;
			if ((Cu(i), i === o))
				if (i.component) {
					let s = n.getOrCreateContext(i.outlet);
					this.activateChildRoutes(e, r, s.children);
				} else this.activateChildRoutes(e, r, n);
			else if (i.component) {
				let s = n.getOrCreateContext(i.outlet);
				if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
					let a = this.routeReuseStrategy.retrieve(i.snapshot);
					this.routeReuseStrategy.store(i.snapshot, null),
						s.children.onOutletReAttached(a.contexts),
						(s.attachRef = a.componentRef),
						(s.route = a.route.value),
						s.outlet &&
							s.outlet.attach(a.componentRef, a.route.value),
						Cu(a.route.value),
						this.activateChildRoutes(e, null, s.children);
				} else {
					let a = Fr(i.snapshot);
					(s.attachRef = null),
						(s.route = i),
						(s.injector = a),
						s.outlet && s.outlet.activateWith(i, s.injector),
						this.activateChildRoutes(e, null, s.children);
				}
			} else this.activateChildRoutes(e, null, n);
		}
	},
	Po = class {
		constructor(e) {
			(this.path = e), (this.route = this.path[this.path.length - 1]);
		}
	},
	xn = class {
		constructor(e, r) {
			(this.component = e), (this.route = r);
		}
	};
function yE(t, e, r) {
	let n = t._root,
		i = e ? e._root : null;
	return Cr(n, i, r, [n.value]);
}
function DE(t) {
	let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
	return !e || e.length === 0 ? null : { node: t, guards: e };
}
function Fn(t, e) {
	let r = Symbol(),
		n = e.get(t, r);
	return n === r ? (typeof t == "function" && !Nl(t) ? t : e.get(t)) : n;
}
function Cr(
	t,
	e,
	r,
	n,
	i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
	let o = Sn(e);
	return (
		t.children.forEach((s) => {
			CE(s, o[s.value.outlet], r, n.concat([s.value]), i),
				delete o[s.value.outlet];
		}),
		Object.entries(o).forEach(([s, a]) => br(a, r.getContext(s), i)),
		i
	);
}
function CE(
	t,
	e,
	r,
	n,
	i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
	let o = t.value,
		s = e ? e.value : null,
		a = r ? r.getContext(t.value.outlet) : null;
	if (s && o.routeConfig === s.routeConfig) {
		let u = wE(s, o, o.routeConfig.runGuardsAndResolvers);
		u
			? i.canActivateChecks.push(new Po(n))
			: ((o.data = s.data), (o._resolvedData = s._resolvedData)),
			o.component
				? Cr(t, e, a ? a.children : null, n, i)
				: Cr(t, e, r, n, i),
			u &&
				a &&
				a.outlet &&
				a.outlet.isActivated &&
				i.canDeactivateChecks.push(new xn(a.outlet.component, s));
	} else
		s && br(e, a, i),
			i.canActivateChecks.push(new Po(n)),
			o.component
				? Cr(t, null, a ? a.children : null, n, i)
				: Cr(t, null, r, n, i);
	return i;
}
function wE(t, e, r) {
	if (typeof r == "function") return r(t, e);
	switch (r) {
		case "pathParamsChange":
			return !Lt(t.url, e.url);
		case "pathParamsOrQueryParamsChange":
			return !Lt(t.url, e.url) || !$e(t.queryParams, e.queryParams);
		case "always":
			return !0;
		case "paramsOrQueryParamsChange":
			return !$u(t, e) || !$e(t.queryParams, e.queryParams);
		case "paramsChange":
		default:
			return !$u(t, e);
	}
}
function br(t, e, r) {
	let n = Sn(t),
		i = t.value;
	Object.entries(n).forEach(([o, s]) => {
		i.component
			? e
				? br(s, e.children.getContext(o), r)
				: br(s, null, r)
			: br(s, e, r);
	}),
		i.component
			? e && e.outlet && e.outlet.isActivated
				? r.canDeactivateChecks.push(new xn(e.outlet.component, i))
				: r.canDeactivateChecks.push(new xn(null, i))
			: r.canDeactivateChecks.push(new xn(null, i));
}
function Pr(t) {
	return typeof t == "function";
}
function EE(t) {
	return typeof t == "boolean";
}
function IE(t) {
	return t && Pr(t.canLoad);
}
function bE(t) {
	return t && Pr(t.canActivate);
}
function ME(t) {
	return t && Pr(t.canActivateChild);
}
function _E(t) {
	return t && Pr(t.canDeactivate);
}
function SE(t) {
	return t && Pr(t.canMatch);
}
function rp(t) {
	return t instanceof Be || t?.name === "EmptyError";
}
var bo = Symbol("INITIAL_VALUE");
function Rn() {
	return ce((t) =>
		ui(t.map((e) => e.pipe(He(1), cs(bo)))).pipe(
			E((e) => {
				for (let r of e)
					if (r !== !0) {
						if (r === bo) return bo;
						if (r === !1 || r instanceof gt) return r;
					}
				return !0;
			}),
			ue((e) => e !== bo),
			He(1),
		),
	);
}
function TE(t, e) {
	return Z((r) => {
		let {
			targetSnapshot: n,
			currentSnapshot: i,
			guards: { canActivateChecks: o, canDeactivateChecks: s },
		} = r;
		return s.length === 0 && o.length === 0
			? M(j(m({}, r), { guardsResult: !0 }))
			: xE(s, n, i, t).pipe(
					Z((a) => (a && EE(a) ? AE(n, o, t, e) : M(a))),
					E((a) => j(m({}, r), { guardsResult: a })),
				);
	});
}
function xE(t, e, r, n) {
	return $(t).pipe(
		Z((i) => PE(i.component, i.route, r, e, n)),
		_e((i) => i !== !0, !0),
	);
}
function AE(t, e, r, n) {
	return $(e).pipe(
		tt((i) =>
			Zt(
				OE(i.route.parent, n),
				NE(i.route, n),
				FE(t, i.path, r),
				RE(t, i.route, r),
			),
		),
		_e((i) => i !== !0, !0),
	);
}
function NE(t, e) {
	return t !== null && e && e(new Pu(t)), M(!0);
}
function OE(t, e) {
	return t !== null && e && e(new Ru(t)), M(!0);
}
function RE(t, e, r) {
	let n = e.routeConfig ? e.routeConfig.canActivate : null;
	if (!n || n.length === 0) return M(!0);
	let i = n.map((o) =>
		ci(() => {
			let s = Fr(e) ?? r,
				a = Fn(o, s),
				u = bE(a) ? a.canActivate(e, t) : Qe(s, () => a(e, t));
			return vt(u).pipe(_e());
		}),
	);
	return M(i).pipe(Rn());
}
function FE(t, e, r) {
	let n = e[e.length - 1],
		o = e
			.slice(0, e.length - 1)
			.reverse()
			.map((s) => DE(s))
			.filter((s) => s !== null)
			.map((s) =>
				ci(() => {
					let a = s.guards.map((u) => {
						let c = Fr(s.node) ?? r,
							l = Fn(u, c),
							d = ME(l)
								? l.canActivateChild(n, t)
								: Qe(c, () => l(n, t));
						return vt(d).pipe(_e());
					});
					return M(a).pipe(Rn());
				}),
			);
	return M(o).pipe(Rn());
}
function PE(t, e, r, n, i) {
	let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
	if (!o || o.length === 0) return M(!0);
	let s = o.map((a) => {
		let u = Fr(e) ?? i,
			c = Fn(a, u),
			l = _E(c)
				? c.canDeactivate(t, e, r, n)
				: Qe(u, () => c(t, e, r, n));
		return vt(l).pipe(_e());
	});
	return M(s).pipe(Rn());
}
function kE(t, e, r, n) {
	let i = e.canLoad;
	if (i === void 0 || i.length === 0) return M(!0);
	let o = i.map((s) => {
		let a = Fn(s, t),
			u = IE(a) ? a.canLoad(e, r) : Qe(t, () => a(e, r));
		return vt(u);
	});
	return M(o).pipe(Rn(), ip(n));
}
function ip(t) {
	return Xo(
		G((e) => {
			if (Nn(e)) throw ep(t, e);
		}),
		E((e) => e === !0),
	);
}
function LE(t, e, r, n) {
	let i = e.canMatch;
	if (!i || i.length === 0) return M(!0);
	let o = i.map((s) => {
		let a = Fn(s, t),
			u = SE(a) ? a.canMatch(e, r) : Qe(t, () => a(e, r));
		return vt(u);
	});
	return M(o).pipe(Rn(), ip(n));
}
var Or = class {
		constructor(e) {
			this.segmentGroup = e || null;
		}
	},
	ko = class extends Error {
		constructor(e) {
			super(), (this.urlTree = e);
		}
	};
function _n(t) {
	return qt(new Or(t));
}
function VE(t) {
	return qt(new C(4e3, !1));
}
function jE(t) {
	return qt(tp(!1, 3));
}
var Hu = class {
		constructor(e, r) {
			(this.urlSerializer = e), (this.urlTree = r);
		}
		lineralizeSegments(e, r) {
			let n = [],
				i = r.root;
			for (;;) {
				if (((n = n.concat(i.segments)), i.numberOfChildren === 0))
					return M(n);
				if (i.numberOfChildren > 1 || !i.children[S])
					return VE(e.redirectTo);
				i = i.children[S];
			}
		}
		applyRedirectCommands(e, r, n) {
			let i = this.applyRedirectCreateUrlTree(
				r,
				this.urlSerializer.parse(r),
				e,
				n,
			);
			if (r.startsWith("/")) throw new ko(i);
			return i;
		}
		applyRedirectCreateUrlTree(e, r, n, i) {
			let o = this.createSegmentGroup(e, r.root, n, i);
			return new gt(
				o,
				this.createQueryParams(r.queryParams, this.urlTree.queryParams),
				r.fragment,
			);
		}
		createQueryParams(e, r) {
			let n = {};
			return (
				Object.entries(e).forEach(([i, o]) => {
					if (typeof o == "string" && o.startsWith(":")) {
						let a = o.substring(1);
						n[i] = r[a];
					} else n[i] = o;
				}),
				n
			);
		}
		createSegmentGroup(e, r, n, i) {
			let o = this.createSegments(e, r.segments, n, i),
				s = {};
			return (
				Object.entries(r.children).forEach(([a, u]) => {
					s[a] = this.createSegmentGroup(e, u, n, i);
				}),
				new P(o, s)
			);
		}
		createSegments(e, r, n, i) {
			return r.map((o) =>
				o.path.startsWith(":")
					? this.findPosParam(e, o, i)
					: this.findOrReturn(o, n),
			);
		}
		findPosParam(e, r, n) {
			let i = n[r.path.substring(1)];
			if (!i) throw new C(4001, !1);
			return i;
		}
		findOrReturn(e, r) {
			let n = 0;
			for (let i of r) {
				if (i.path === e.path) return r.splice(n), i;
				n++;
			}
			return e;
		}
	},
	zu = {
		matched: !1,
		consumedSegments: [],
		remainingSegments: [],
		parameters: {},
		positionalParamSegments: {},
	};
function $E(t, e, r, n, i) {
	let o = ec(t, e, r);
	return o.matched
		? ((n = gE(e, n)),
			LE(n, e, r, i).pipe(E((s) => (s === !0 ? o : m({}, zu)))))
		: M(o);
}
function ec(t, e, r) {
	if (e.path === "**") return UE(r);
	if (e.path === "")
		return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
			? m({}, zu)
			: {
					matched: !0,
					consumedSegments: [],
					remainingSegments: r,
					parameters: {},
					positionalParamSegments: {},
				};
	let i = (e.matcher || Lw)(r, t, e);
	if (!i) return m({}, zu);
	let o = {};
	Object.entries(i.posParams ?? {}).forEach(([a, u]) => {
		o[a] = u.path;
	});
	let s =
		i.consumed.length > 0
			? m(m({}, o), i.consumed[i.consumed.length - 1].parameters)
			: o;
	return {
		matched: !0,
		consumedSegments: i.consumed,
		remainingSegments: r.slice(i.consumed.length),
		parameters: s,
		positionalParamSegments: i.posParams ?? {},
	};
}
function UE(t) {
	return {
		matched: !0,
		parameters: t.length > 0 ? Lh(t).parameters : {},
		consumedSegments: t,
		remainingSegments: [],
		positionalParamSegments: {},
	};
}
function Ph(t, e, r, n) {
	return r.length > 0 && zE(t, r, n)
		? {
				segmentGroup: new P(e, HE(n, new P(r, t.children))),
				slicedSegments: [],
			}
		: r.length === 0 && GE(t, r, n)
			? {
					segmentGroup: new P(t.segments, BE(t, e, r, n, t.children)),
					slicedSegments: r,
				}
			: {
					segmentGroup: new P(t.segments, t.children),
					slicedSegments: r,
				};
}
function BE(t, e, r, n, i) {
	let o = {};
	for (let s of n)
		if (Vo(t, r, s) && !i[Ue(s)]) {
			let a = new P([], {});
			o[Ue(s)] = a;
		}
	return m(m({}, i), o);
}
function HE(t, e) {
	let r = {};
	r[S] = e;
	for (let n of t)
		if (n.path === "" && Ue(n) !== S) {
			let i = new P([], {});
			r[Ue(n)] = i;
		}
	return r;
}
function zE(t, e, r) {
	return r.some((n) => Vo(t, e, n) && Ue(n) !== S);
}
function GE(t, e, r) {
	return r.some((n) => Vo(t, e, n));
}
function Vo(t, e, r) {
	return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
		? !1
		: r.path === "";
}
function WE(t, e, r, n) {
	return Ue(t) !== n && (n === S || !Vo(e, r, t)) ? !1 : ec(e, t, r).matched;
}
function qE(t, e, r) {
	return e.length === 0 && !t.children[r];
}
var Gu = class {};
function ZE(t, e, r, n, i, o, s = "emptyOnly") {
	return new Wu(t, e, r, n, i, s, o).recognize();
}
var YE = 31,
	Wu = class {
		constructor(e, r, n, i, o, s, a) {
			(this.injector = e),
				(this.configLoader = r),
				(this.rootComponentType = n),
				(this.config = i),
				(this.urlTree = o),
				(this.paramsInheritanceStrategy = s),
				(this.urlSerializer = a),
				(this.applyRedirects = new Hu(
					this.urlSerializer,
					this.urlTree,
				)),
				(this.absoluteRedirectCount = 0),
				(this.allowRedirects = !0);
		}
		noMatchError(e) {
			return new C(4002, `'${e.segmentGroup}'`);
		}
		recognize() {
			let e = Ph(this.urlTree.root, [], [], this.config).segmentGroup;
			return this.match(e).pipe(
				E((r) => {
					let n = new Ar(
							[],
							Object.freeze({}),
							Object.freeze(m({}, this.urlTree.queryParams)),
							this.urlTree.fragment,
							{},
							S,
							this.rootComponentType,
							null,
							{},
						),
						i = new ge(n, r),
						o = new Fo("", i),
						s = nE(
							n,
							[],
							this.urlTree.queryParams,
							this.urlTree.fragment,
						);
					return (
						(s.queryParams = this.urlTree.queryParams),
						(o.url = this.urlSerializer.serialize(s)),
						this.inheritParamsAndData(o._root, null),
						{ state: o, tree: s }
					);
				}),
			);
		}
		match(e) {
			return this.processSegmentGroup(
				this.injector,
				this.config,
				e,
				S,
			).pipe(
				et((n) => {
					if (n instanceof ko)
						return (
							(this.urlTree = n.urlTree),
							this.match(n.urlTree.root)
						);
					throw n instanceof Or ? this.noMatchError(n) : n;
				}),
			);
		}
		inheritParamsAndData(e, r) {
			let n = e.value,
				i = Yu(n, r, this.paramsInheritanceStrategy);
			(n.params = Object.freeze(i.params)),
				(n.data = Object.freeze(i.data)),
				e.children.forEach((o) => this.inheritParamsAndData(o, n));
		}
		processSegmentGroup(e, r, n, i) {
			return n.segments.length === 0 && n.hasChildren()
				? this.processChildren(e, r, n)
				: this.processSegment(e, r, n, n.segments, i, !0).pipe(
						E((o) => (o instanceof ge ? [o] : [])),
					);
		}
		processChildren(e, r, n) {
			let i = [];
			for (let o of Object.keys(n.children))
				o === "primary" ? i.unshift(o) : i.push(o);
			return $(i).pipe(
				tt((o) => {
					let s = n.children[o],
						a = mE(r, o);
					return this.processSegmentGroup(e, a, s, o);
				}),
				us((o, s) => (o.push(...s), o)),
				nt(null),
				as(),
				Z((o) => {
					if (o === null) return _n(n);
					let s = op(o);
					return QE(s), M(s);
				}),
			);
		}
		processSegment(e, r, n, i, o, s) {
			return $(r).pipe(
				tt((a) =>
					this.processSegmentAgainstRoute(
						a._injector ?? e,
						r,
						a,
						n,
						i,
						o,
						s,
					).pipe(
						et((u) => {
							if (u instanceof Or) return M(null);
							throw u;
						}),
					),
				),
				_e((a) => !!a),
				et((a) => {
					if (rp(a)) return qE(n, i, o) ? M(new Gu()) : _n(n);
					throw a;
				}),
			);
		}
		processSegmentAgainstRoute(e, r, n, i, o, s, a) {
			return WE(n, i, o, s)
				? n.redirectTo === void 0
					? this.matchSegmentAgainstRoute(e, i, n, o, s)
					: this.allowRedirects && a
						? this.expandSegmentAgainstRouteUsingRedirect(
								e,
								i,
								r,
								n,
								o,
								s,
							)
						: _n(i)
				: _n(i);
		}
		expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s) {
			let {
				matched: a,
				consumedSegments: u,
				positionalParamSegments: c,
				remainingSegments: l,
			} = ec(r, i, o);
			if (!a) return _n(r);
			i.redirectTo.startsWith("/") &&
				(this.absoluteRedirectCount++,
				this.absoluteRedirectCount > YE && (this.allowRedirects = !1));
			let d = this.applyRedirects.applyRedirectCommands(
				u,
				i.redirectTo,
				c,
			);
			return this.applyRedirects
				.lineralizeSegments(i, d)
				.pipe(
					Z((f) => this.processSegment(e, n, r, f.concat(l), s, !1)),
				);
		}
		matchSegmentAgainstRoute(e, r, n, i, o) {
			let s = $E(r, n, i, e, this.urlSerializer);
			return (
				n.path === "**" && (r.children = {}),
				s.pipe(
					ce((a) =>
						a.matched
							? ((e = n._injector ?? e),
								this.getChildConfig(e, n, i).pipe(
									ce(({ routes: u }) => {
										let c = n._loadedInjector ?? e,
											{
												consumedSegments: l,
												remainingSegments: d,
												parameters: f,
											} = a,
											h = new Ar(
												l,
												f,
												Object.freeze(
													m(
														{},
														this.urlTree
															.queryParams,
													),
												),
												this.urlTree.fragment,
												JE(n),
												Ue(n),
												n.component ??
													n._loadedComponent ??
													null,
												n,
												XE(n),
											),
											{
												segmentGroup: g,
												slicedSegments: T,
											} = Ph(r, l, d, u);
										if (T.length === 0 && g.hasChildren())
											return this.processChildren(
												c,
												u,
												g,
											).pipe(
												E((y) =>
													y === null
														? null
														: new ge(h, y),
												),
											);
										if (u.length === 0 && T.length === 0)
											return M(new ge(h, []));
										let b = Ue(n) === o;
										return this.processSegment(
											c,
											u,
											g,
											T,
											b ? S : o,
											!0,
										).pipe(
											E(
												(y) =>
													new ge(
														h,
														y instanceof ge
															? [y]
															: [],
													),
											),
										);
									}),
								))
							: _n(r),
					),
				)
			);
		}
		getChildConfig(e, r, n) {
			return r.children
				? M({ routes: r.children, injector: e })
				: r.loadChildren
					? r._loadedRoutes !== void 0
						? M({
								routes: r._loadedRoutes,
								injector: r._loadedInjector,
							})
						: kE(e, r, n, this.urlSerializer).pipe(
								Z((i) =>
									i
										? this.configLoader
												.loadChildren(e, r)
												.pipe(
													G((o) => {
														(r._loadedRoutes =
															o.routes),
															(r._loadedInjector =
																o.injector);
													}),
												)
										: jE(r),
								),
							)
					: M({ routes: [], injector: e });
		}
	};
function QE(t) {
	t.sort((e, r) =>
		e.value.outlet === S
			? -1
			: r.value.outlet === S
				? 1
				: e.value.outlet.localeCompare(r.value.outlet),
	);
}
function KE(t) {
	let e = t.value.routeConfig;
	return e && e.path === "";
}
function op(t) {
	let e = [],
		r = new Set();
	for (let n of t) {
		if (!KE(n)) {
			e.push(n);
			continue;
		}
		let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
		i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
	}
	for (let n of r) {
		let i = op(n.children);
		e.push(new ge(n.value, i));
	}
	return e.filter((n) => !r.has(n));
}
function JE(t) {
	return t.data || {};
}
function XE(t) {
	return t.resolve || {};
}
function eI(t, e, r, n, i, o) {
	return Z((s) =>
		ZE(t, e, r, n, s.extractedUrl, i, o).pipe(
			E(({ state: a, tree: u }) =>
				j(m({}, s), { targetSnapshot: a, urlAfterRedirects: u }),
			),
		),
	);
}
function tI(t, e) {
	return Z((r) => {
		let {
			targetSnapshot: n,
			guards: { canActivateChecks: i },
		} = r;
		if (!i.length) return M(r);
		let o = new Set(i.map((u) => u.route)),
			s = new Set();
		for (let u of o) if (!s.has(u)) for (let c of sp(u)) s.add(c);
		let a = 0;
		return $(s).pipe(
			tt((u) =>
				o.has(u)
					? nI(u, n, t, e)
					: ((u.data = Yu(u, u.parent, t).resolve), M(void 0)),
			),
			G(() => a++),
			Yt(1),
			Z((u) => (a === s.size ? M(r) : ve)),
		);
	});
}
function sp(t) {
	let e = t.children.map((r) => sp(r)).flat();
	return [t, ...e];
}
function nI(t, e, r, n) {
	let i = t.routeConfig,
		o = t._resolve;
	return (
		i?.title !== void 0 && !Jh(i) && (o[Rr] = i.title),
		rI(o, t, e, n).pipe(
			E(
				(s) => (
					(t._resolvedData = s),
					(t.data = Yu(t, t.parent, r).resolve),
					null
				),
			),
		)
	);
}
function rI(t, e, r, n) {
	let i = Iu(t);
	if (i.length === 0) return M({});
	let o = {};
	return $(i).pipe(
		Z((s) =>
			iI(t[s], e, r, n).pipe(
				_e(),
				G((a) => {
					o[s] = a;
				}),
			),
		),
		Yt(1),
		ss(o),
		et((s) => (rp(s) ? ve : qt(s))),
	);
}
function iI(t, e, r, n) {
	let i = Fr(e) ?? n,
		o = Fn(t, i),
		s = o.resolve ? o.resolve(e, r) : Qe(i, () => o(e, r));
	return vt(s);
}
function wu(t) {
	return ce((e) => {
		let r = t(e);
		return r ? $(r).pipe(E(() => e)) : M(e);
	});
}
var ap = (() => {
		let e = class e {
			buildTitle(n) {
				let i,
					o = n.root;
				for (; o !== void 0; )
					(i = this.getResolvedTitleForRoute(o) ?? i),
						(o = o.children.find((s) => s.outlet === S));
				return i;
			}
			getResolvedTitleForRoute(n) {
				return n.data[Rr];
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({
				token: e,
				factory: () => (() => p(oI))(),
				providedIn: "root",
			}));
		let t = e;
		return t;
	})(),
	oI = (() => {
		let e = class e extends ap {
			constructor(n) {
				super(), (this.title = n);
			}
			updateTitle(n) {
				let i = this.buildTitle(n);
				i !== void 0 && this.title.setTitle(i);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(D(vu));
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})(),
	tc = new w("", { providedIn: "root", factory: () => ({}) }),
	nc = new w("ROUTES"),
	sI = (() => {
		let e = class e {
			constructor() {
				(this.componentLoaders = new WeakMap()),
					(this.childrenLoaders = new WeakMap()),
					(this.compiler = p(Ka));
			}
			loadComponent(n) {
				if (this.componentLoaders.get(n))
					return this.componentLoaders.get(n);
				if (n._loadedComponent) return M(n._loadedComponent);
				this.onLoadStartListener && this.onLoadStartListener(n);
				let i = vt(n.loadComponent()).pipe(
						E(up),
						G((s) => {
							this.onLoadEndListener && this.onLoadEndListener(n),
								(n._loadedComponent = s);
						}),
						wt(() => {
							this.componentLoaders.delete(n);
						}),
					),
					o = new Wt(i, () => new ae()).pipe(Gt());
				return this.componentLoaders.set(n, o), o;
			}
			loadChildren(n, i) {
				if (this.childrenLoaders.get(i))
					return this.childrenLoaders.get(i);
				if (i._loadedRoutes)
					return M({
						routes: i._loadedRoutes,
						injector: i._loadedInjector,
					});
				this.onLoadStartListener && this.onLoadStartListener(i);
				let s = aI(i, this.compiler, n, this.onLoadEndListener).pipe(
						wt(() => {
							this.childrenLoaders.delete(i);
						}),
					),
					a = new Wt(s, () => new ae()).pipe(Gt());
				return this.childrenLoaders.set(i, a), a;
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})();
function aI(t, e, r, n) {
	return vt(t.loadChildren()).pipe(
		E(up),
		Z((i) =>
			i instanceof er || Array.isArray(i)
				? M(i)
				: $(e.compileModuleAsync(i)),
		),
		E((i) => {
			n && n(t);
			let o,
				s,
				a = !1;
			return (
				Array.isArray(i)
					? ((s = i), (a = !0))
					: ((o = i.create(r).injector),
						(s = o.get(nc, [], { optional: !0, self: !0 }).flat())),
				{ routes: s.map(Xu), injector: o }
			);
		}),
	);
}
function uI(t) {
	return t && typeof t == "object" && "default" in t;
}
function up(t) {
	return uI(t) ? t.default : t;
}
var rc = (() => {
		let e = class e {};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({
				token: e,
				factory: () => (() => p(cI))(),
				providedIn: "root",
			}));
		let t = e;
		return t;
	})(),
	cI = (() => {
		let e = class e {
			shouldProcessUrl(n) {
				return !0;
			}
			extract(n) {
				return n;
			}
			merge(n, i) {
				return n;
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})(),
	lI = new w("");
var dI = (() => {
	let e = class e {
		get hasRequestedNavigation() {
			return this.navigationId !== 0;
		}
		constructor() {
			(this.currentNavigation = null),
				(this.currentTransition = null),
				(this.lastSuccessfulNavigation = null),
				(this.events = new ae()),
				(this.transitionAbortSubject = new ae()),
				(this.configLoader = p(sI)),
				(this.environmentInjector = p(re)),
				(this.urlSerializer = p(Zu)),
				(this.rootContexts = p(Lo)),
				(this.location = p(dr)),
				(this.inputBindingEnabled = p(Ju, { optional: !0 }) !== null),
				(this.titleStrategy = p(ap)),
				(this.options = p(tc, { optional: !0 }) || {}),
				(this.paramsInheritanceStrategy =
					this.options.paramsInheritanceStrategy || "emptyOnly"),
				(this.urlHandlingStrategy = p(rc)),
				(this.createViewTransition = p(lI, { optional: !0 })),
				(this.navigationId = 0),
				(this.afterPreactivation = () => M(void 0)),
				(this.rootComponentType = null);
			let n = (o) => this.events.next(new Nu(o)),
				i = (o) => this.events.next(new Ou(o));
			(this.configLoader.onLoadEndListener = i),
				(this.configLoader.onLoadStartListener = n);
		}
		complete() {
			this.transitions?.complete();
		}
		handleNavigationRequest(n) {
			let i = ++this.navigationId;
			this.transitions?.next(
				j(m(m({}, this.transitions.value), n), { id: i }),
			);
		}
		setupNavigations(n, i, o) {
			return (
				(this.transitions = new Q({
					id: 0,
					currentUrlTree: i,
					currentRawUrl: i,
					extractedUrl: this.urlHandlingStrategy.extract(i),
					urlAfterRedirects: this.urlHandlingStrategy.extract(i),
					rawUrl: i,
					extras: {},
					resolve: null,
					reject: null,
					promise: Promise.resolve(!0),
					source: Ir,
					restoredState: null,
					currentSnapshot: o.snapshot,
					targetSnapshot: null,
					currentRouterState: o,
					targetRouterState: null,
					guards: { canActivateChecks: [], canDeactivateChecks: [] },
					guardsResult: null,
				})),
				this.transitions.pipe(
					ue((s) => s.id !== 0),
					E((s) =>
						j(m({}, s), {
							extractedUrl: this.urlHandlingStrategy.extract(
								s.rawUrl,
							),
						}),
					),
					ce((s) => {
						this.currentTransition = s;
						let a = !1,
							u = !1;
						return M(s).pipe(
							G((c) => {
								this.currentNavigation = {
									id: c.id,
									initialUrl: c.rawUrl,
									extractedUrl: c.extractedUrl,
									trigger: c.source,
									extras: c.extras,
									previousNavigation: this
										.lastSuccessfulNavigation
										? j(
												m(
													{},
													this
														.lastSuccessfulNavigation,
												),
												{ previousNavigation: null },
											)
										: null,
								};
							}),
							ce((c) => {
								let l =
										!n.navigated ||
										this.isUpdatingInternalState() ||
										this.isUpdatedBrowserUrl(),
									d =
										c.extras.onSameUrlNavigation ??
										n.onSameUrlNavigation;
								if (!l && d !== "reload") {
									let f = "";
									return (
										this.events.next(
											new jt(
												c.id,
												this.urlSerializer.serialize(
													c.rawUrl,
												),
												f,
												0,
											),
										),
										c.resolve(null),
										ve
									);
								}
								if (
									this.urlHandlingStrategy.shouldProcessUrl(
										c.rawUrl,
									)
								)
									return M(c).pipe(
										ce((f) => {
											let h =
												this.transitions?.getValue();
											return (
												this.events.next(
													new _r(
														f.id,
														this.urlSerializer.serialize(
															f.extractedUrl,
														),
														f.source,
														f.restoredState,
													),
												),
												h !==
												this.transitions?.getValue()
													? ve
													: Promise.resolve(f)
											);
										}),
										eI(
											this.environmentInjector,
											this.configLoader,
											this.rootComponentType,
											n.config,
											this.urlSerializer,
											this.paramsInheritanceStrategy,
										),
										G((f) => {
											(s.targetSnapshot =
												f.targetSnapshot),
												(s.urlAfterRedirects =
													f.urlAfterRedirects),
												(this.currentNavigation = j(
													m(
														{},
														this.currentNavigation,
													),
													{
														finalUrl:
															f.urlAfterRedirects,
													},
												));
											let h = new No(
												f.id,
												this.urlSerializer.serialize(
													f.extractedUrl,
												),
												this.urlSerializer.serialize(
													f.urlAfterRedirects,
												),
												f.targetSnapshot,
											);
											this.events.next(h);
										}),
									);
								if (
									l &&
									this.urlHandlingStrategy.shouldProcessUrl(
										c.currentRawUrl,
									)
								) {
									let {
											id: f,
											extractedUrl: h,
											source: g,
											restoredState: T,
											extras: b,
										} = c,
										y = new _r(
											f,
											this.urlSerializer.serialize(h),
											g,
											T,
										);
									this.events.next(y);
									let U = Qh(
										h,
										this.rootComponentType,
									).snapshot;
									return (
										(this.currentTransition = s =
											j(m({}, c), {
												targetSnapshot: U,
												urlAfterRedirects: h,
												extras: j(m({}, b), {
													skipLocationChange: !1,
													replaceUrl: !1,
												}),
											})),
										(this.currentNavigation.finalUrl = h),
										M(s)
									);
								} else {
									let f = "";
									return (
										this.events.next(
											new jt(
												c.id,
												this.urlSerializer.serialize(
													c.extractedUrl,
												),
												f,
												1,
											),
										),
										c.resolve(null),
										ve
									);
								}
							}),
							G((c) => {
								let l = new Su(
									c.id,
									this.urlSerializer.serialize(
										c.extractedUrl,
									),
									this.urlSerializer.serialize(
										c.urlAfterRedirects,
									),
									c.targetSnapshot,
								);
								this.events.next(l);
							}),
							E(
								(c) => (
									(this.currentTransition = s =
										j(m({}, c), {
											guards: yE(
												c.targetSnapshot,
												c.currentSnapshot,
												this.rootContexts,
											),
										})),
									s
								),
							),
							TE(this.environmentInjector, (c) =>
								this.events.next(c),
							),
							G((c) => {
								if (
									((s.guardsResult = c.guardsResult),
									Nn(c.guardsResult))
								)
									throw ep(
										this.urlSerializer,
										c.guardsResult,
									);
								let l = new Tu(
									c.id,
									this.urlSerializer.serialize(
										c.extractedUrl,
									),
									this.urlSerializer.serialize(
										c.urlAfterRedirects,
									),
									c.targetSnapshot,
									!!c.guardsResult,
								);
								this.events.next(l);
							}),
							ue((c) =>
								c.guardsResult
									? !0
									: (this.cancelNavigationTransition(
											c,
											"",
											3,
										),
										!1),
							),
							wu((c) => {
								if (c.guards.canActivateChecks.length)
									return M(c).pipe(
										G((l) => {
											let d = new xu(
												l.id,
												this.urlSerializer.serialize(
													l.extractedUrl,
												),
												this.urlSerializer.serialize(
													l.urlAfterRedirects,
												),
												l.targetSnapshot,
											);
											this.events.next(d);
										}),
										ce((l) => {
											let d = !1;
											return M(l).pipe(
												tI(
													this
														.paramsInheritanceStrategy,
													this.environmentInjector,
												),
												G({
													next: () => (d = !0),
													complete: () => {
														d ||
															this.cancelNavigationTransition(
																l,
																"",
																2,
															);
													},
												}),
											);
										}),
										G((l) => {
											let d = new Au(
												l.id,
												this.urlSerializer.serialize(
													l.extractedUrl,
												),
												this.urlSerializer.serialize(
													l.urlAfterRedirects,
												),
												l.targetSnapshot,
											);
											this.events.next(d);
										}),
									);
							}),
							wu((c) => {
								let l = (d) => {
									let f = [];
									d.routeConfig?.loadComponent &&
										!d.routeConfig._loadedComponent &&
										f.push(
											this.configLoader
												.loadComponent(d.routeConfig)
												.pipe(
													G((h) => {
														d.component = h;
													}),
													E(() => {}),
												),
										);
									for (let h of d.children) f.push(...l(h));
									return f;
								};
								return ui(l(c.targetSnapshot.root)).pipe(
									nt(null),
									He(1),
								);
							}),
							wu(() => this.afterPreactivation()),
							ce(() => {
								let { currentSnapshot: c, targetSnapshot: l } =
										s,
									d = this.createViewTransition?.(
										this.environmentInjector,
										c.root,
										l.root,
									);
								return d ? $(d).pipe(E(() => s)) : M(s);
							}),
							E((c) => {
								let l = lE(
									n.routeReuseStrategy,
									c.targetSnapshot,
									c.currentRouterState,
								);
								return (
									(this.currentTransition = s =
										j(m({}, c), { targetRouterState: l })),
									(this.currentNavigation.targetRouterState =
										l),
									s
								);
							}),
							G(() => {
								this.events.next(new Tr());
							}),
							vE(
								this.rootContexts,
								n.routeReuseStrategy,
								(c) => this.events.next(c),
								this.inputBindingEnabled,
							),
							He(1),
							G({
								next: (c) => {
									(a = !0),
										(this.lastSuccessfulNavigation =
											this.currentNavigation),
										this.events.next(
											new Vt(
												c.id,
												this.urlSerializer.serialize(
													c.extractedUrl,
												),
												this.urlSerializer.serialize(
													c.urlAfterRedirects,
												),
											),
										),
										this.titleStrategy?.updateTitle(
											c.targetRouterState.snapshot,
										),
										c.resolve(!0);
								},
								complete: () => {
									a = !0;
								},
							}),
							ls(
								this.transitionAbortSubject.pipe(
									G((c) => {
										throw c;
									}),
								),
							),
							wt(() => {
								if (!a && !u) {
									let c = "";
									this.cancelNavigationTransition(s, c, 1);
								}
								this.currentNavigation?.id === s.id &&
									(this.currentNavigation = null);
							}),
							et((c) => {
								if (((u = !0), np(c)))
									this.events.next(
										new mt(
											s.id,
											this.urlSerializer.serialize(
												s.extractedUrl,
											),
											c.message,
											c.cancellationCode,
										),
									),
										hE(c)
											? this.events.next(new xr(c.url))
											: s.resolve(!1);
								else {
									this.events.next(
										new Sr(
											s.id,
											this.urlSerializer.serialize(
												s.extractedUrl,
											),
											c,
											s.targetSnapshot ?? void 0,
										),
									);
									try {
										s.resolve(n.errorHandler(c));
									} catch (l) {
										s.reject(l);
									}
								}
								return ve;
							}),
						);
					}),
				)
			);
		}
		cancelNavigationTransition(n, i, o) {
			let s = new mt(
				n.id,
				this.urlSerializer.serialize(n.extractedUrl),
				i,
				o,
			);
			this.events.next(s), n.resolve(!1);
		}
		isUpdatingInternalState() {
			return (
				this.currentTransition?.extractedUrl.toString() !==
				this.currentTransition?.currentUrlTree.toString()
			);
		}
		isUpdatedBrowserUrl() {
			return (
				this.urlHandlingStrategy
					.extract(this.urlSerializer.parse(this.location.path(!0)))
					.toString() !==
					this.currentTransition?.extractedUrl.toString() &&
				!this.currentTransition?.extras.skipLocationChange
			);
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
	let t = e;
	return t;
})();
function fI(t) {
	return t !== Ir;
}
var hI = (() => {
		let e = class e {};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({
				token: e,
				factory: () => (() => p(pI))(),
				providedIn: "root",
			}));
		let t = e;
		return t;
	})(),
	qu = class {
		shouldDetach(e) {
			return !1;
		}
		store(e, r) {}
		shouldAttach(e) {
			return !1;
		}
		retrieve(e) {
			return null;
		}
		shouldReuseRoute(e, r) {
			return e.routeConfig === r.routeConfig;
		}
	},
	pI = (() => {
		let e = class e extends qu {};
		(e.ɵfac = (() => {
			let n;
			return function (o) {
				return (n || (n = sr(e)))(o || e);
			};
		})()),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})(),
	cp = (() => {
		let e = class e {};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({
				token: e,
				factory: () => (() => p(gI))(),
				providedIn: "root",
			}));
		let t = e;
		return t;
	})(),
	gI = (() => {
		let e = class e extends cp {
			constructor() {
				super(...arguments),
					(this.location = p(dr)),
					(this.urlSerializer = p(Zu)),
					(this.options = p(tc, { optional: !0 }) || {}),
					(this.canceledNavigationResolution =
						this.options.canceledNavigationResolution || "replace"),
					(this.urlHandlingStrategy = p(rc)),
					(this.urlUpdateStrategy =
						this.options.urlUpdateStrategy || "deferred"),
					(this.currentUrlTree = new gt()),
					(this.rawUrlTree = this.currentUrlTree),
					(this.currentPageId = 0),
					(this.lastSuccessfulId = -1),
					(this.routerState = Qh(this.currentUrlTree, null)),
					(this.stateMemento = this.createStateMemento());
			}
			getCurrentUrlTree() {
				return this.currentUrlTree;
			}
			getRawUrlTree() {
				return this.rawUrlTree;
			}
			restoredState() {
				return this.location.getState();
			}
			get browserPageId() {
				return this.canceledNavigationResolution !== "computed"
					? this.currentPageId
					: this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
			}
			getRouterState() {
				return this.routerState;
			}
			createStateMemento() {
				return {
					rawUrlTree: this.rawUrlTree,
					currentUrlTree: this.currentUrlTree,
					routerState: this.routerState,
				};
			}
			registerNonRouterCurrentEntryChangeListener(n) {
				return this.location.subscribe((i) => {
					i.type === "popstate" && n(i.url, i.state);
				});
			}
			handleRouterEvent(n, i) {
				if (n instanceof _r)
					this.stateMemento = this.createStateMemento();
				else if (n instanceof jt) this.rawUrlTree = i.initialUrl;
				else if (n instanceof No) {
					if (
						this.urlUpdateStrategy === "eager" &&
						!i.extras.skipLocationChange
					) {
						let o = this.urlHandlingStrategy.merge(
							i.finalUrl,
							i.initialUrl,
						);
						this.setBrowserUrl(o, i);
					}
				} else
					n instanceof Tr
						? ((this.currentUrlTree = i.finalUrl),
							(this.rawUrlTree = this.urlHandlingStrategy.merge(
								i.finalUrl,
								i.initialUrl,
							)),
							(this.routerState = i.targetRouterState),
							this.urlUpdateStrategy === "deferred" &&
								(i.extras.skipLocationChange ||
									this.setBrowserUrl(this.rawUrlTree, i)))
						: n instanceof mt && (n.code === 3 || n.code === 2)
							? this.restoreHistory(i)
							: n instanceof Sr
								? this.restoreHistory(i, !0)
								: n instanceof Vt &&
									((this.lastSuccessfulId = n.id),
									(this.currentPageId = this.browserPageId));
			}
			setBrowserUrl(n, i) {
				let o = this.urlSerializer.serialize(n);
				if (
					this.location.isCurrentPathEqualTo(o) ||
					i.extras.replaceUrl
				) {
					let s = this.browserPageId,
						a = m(
							m({}, i.extras.state),
							this.generateNgRouterState(i.id, s),
						);
					this.location.replaceState(o, "", a);
				} else {
					let s = m(
						m({}, i.extras.state),
						this.generateNgRouterState(
							i.id,
							this.browserPageId + 1,
						),
					);
					this.location.go(o, "", s);
				}
			}
			restoreHistory(n, i = !1) {
				if (this.canceledNavigationResolution === "computed") {
					let o = this.browserPageId,
						s = this.currentPageId - o;
					s !== 0
						? this.location.historyGo(s)
						: this.currentUrlTree === n.finalUrl &&
							s === 0 &&
							(this.resetState(n),
							this.resetUrlToCurrentUrlTree());
				} else
					this.canceledNavigationResolution === "replace" &&
						(i && this.resetState(n),
						this.resetUrlToCurrentUrlTree());
			}
			resetState(n) {
				(this.routerState = this.stateMemento.routerState),
					(this.currentUrlTree = this.stateMemento.currentUrlTree),
					(this.rawUrlTree = this.urlHandlingStrategy.merge(
						this.currentUrlTree,
						n.finalUrl ?? this.rawUrlTree,
					));
			}
			resetUrlToCurrentUrlTree() {
				this.location.replaceState(
					this.urlSerializer.serialize(this.rawUrlTree),
					"",
					this.generateNgRouterState(
						this.lastSuccessfulId,
						this.currentPageId,
					),
				);
			}
			generateNgRouterState(n, i) {
				return this.canceledNavigationResolution === "computed"
					? { navigationId: n, ɵrouterPageId: i }
					: { navigationId: n };
			}
		};
		(e.ɵfac = (() => {
			let n;
			return function (o) {
				return (n || (n = sr(e)))(o || e);
			};
		})()),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})(),
	wr = (function (t) {
		return (
			(t[(t.COMPLETE = 0)] = "COMPLETE"),
			(t[(t.FAILED = 1)] = "FAILED"),
			(t[(t.REDIRECTING = 2)] = "REDIRECTING"),
			t
		);
	})(wr || {});
function mI(t, e) {
	t.events
		.pipe(
			ue(
				(r) =>
					r instanceof Vt ||
					r instanceof mt ||
					r instanceof Sr ||
					r instanceof jt,
			),
			E((r) =>
				r instanceof Vt || r instanceof jt
					? wr.COMPLETE
					: (r instanceof mt ? r.code === 0 || r.code === 1 : !1)
						? wr.REDIRECTING
						: wr.FAILED,
			),
			ue((r) => r !== wr.REDIRECTING),
			He(1),
		)
		.subscribe(() => {
			e();
		});
}
function vI(t) {
	throw t;
}
var yI = {
		paths: "exact",
		fragment: "ignored",
		matrixParams: "ignored",
		queryParams: "exact",
	},
	DI = {
		paths: "subset",
		fragment: "ignored",
		matrixParams: "ignored",
		queryParams: "subset",
	},
	lp = (() => {
		let e = class e {
			get currentUrlTree() {
				return this.stateManager.getCurrentUrlTree();
			}
			get rawUrlTree() {
				return this.stateManager.getRawUrlTree();
			}
			get events() {
				return this._events;
			}
			get routerState() {
				return this.stateManager.getRouterState();
			}
			constructor() {
				(this.disposed = !1),
					(this.isNgZoneEnabled = !1),
					(this.console = p(lo)),
					(this.stateManager = p(cp)),
					(this.options = p(tc, { optional: !0 }) || {}),
					(this.pendingTasks = p(wn)),
					(this.urlUpdateStrategy =
						this.options.urlUpdateStrategy || "deferred"),
					(this.navigationTransitions = p(dI)),
					(this.urlSerializer = p(Zu)),
					(this.location = p(dr)),
					(this.urlHandlingStrategy = p(rc)),
					(this._events = new ae()),
					(this.errorHandler = this.options.errorHandler || vI),
					(this.navigated = !1),
					(this.routeReuseStrategy = p(hI)),
					(this.onSameUrlNavigation =
						this.options.onSameUrlNavigation || "ignore"),
					(this.config = p(nc, { optional: !0 })?.flat() ?? []),
					(this.componentInputBindingEnabled = !!p(Ju, {
						optional: !0,
					})),
					(this.eventsSubscription = new q()),
					(this.isNgZoneEnabled =
						p(B) instanceof B && B.isInAngularZone()),
					this.resetConfig(this.config),
					this.navigationTransitions
						.setupNavigations(
							this,
							this.currentUrlTree,
							this.routerState,
						)
						.subscribe({
							error: (n) => {
								this.console.warn(n);
							},
						}),
					this.subscribeToNavigationEvents();
			}
			subscribeToNavigationEvents() {
				let n = this.navigationTransitions.events.subscribe((i) => {
					try {
						let o = this.navigationTransitions.currentTransition,
							s = this.navigationTransitions.currentNavigation;
						if (o !== null && s !== null) {
							if (
								(this.stateManager.handleRouterEvent(i, s),
								i instanceof mt && i.code !== 0 && i.code !== 1)
							)
								this.navigated = !0;
							else if (i instanceof Vt) this.navigated = !0;
							else if (i instanceof xr) {
								let a = this.urlHandlingStrategy.merge(
										i.url,
										o.currentRawUrl,
									),
									u = {
										skipLocationChange:
											o.extras.skipLocationChange,
										replaceUrl:
											this.urlUpdateStrategy ===
												"eager" || fI(o.source),
									};
								this.scheduleNavigation(a, Ir, null, u, {
									resolve: o.resolve,
									reject: o.reject,
									promise: o.promise,
								});
							}
						}
						wI(i) && this._events.next(i);
					} catch (o) {
						this.navigationTransitions.transitionAbortSubject.next(
							o,
						);
					}
				});
				this.eventsSubscription.add(n);
			}
			resetRootComponentType(n) {
				(this.routerState.root.component = n),
					(this.navigationTransitions.rootComponentType = n);
			}
			initialNavigation() {
				this.setUpLocationChangeListener(),
					this.navigationTransitions.hasRequestedNavigation ||
						this.navigateToSyncWithBrowser(
							this.location.path(!0),
							Ir,
							this.stateManager.restoredState(),
						);
			}
			setUpLocationChangeListener() {
				this.nonRouterCurrentEntryChangeSubscription ||
					(this.nonRouterCurrentEntryChangeSubscription =
						this.stateManager.registerNonRouterCurrentEntryChangeListener(
							(n, i) => {
								setTimeout(() => {
									this.navigateToSyncWithBrowser(
										n,
										"popstate",
										i,
									);
								}, 0);
							},
						));
			}
			navigateToSyncWithBrowser(n, i, o) {
				let s = { replaceUrl: !0 },
					a = o?.navigationId ? o : null;
				if (o) {
					let c = m({}, o);
					delete c.navigationId,
						delete c.ɵrouterPageId,
						Object.keys(c).length !== 0 && (s.state = c);
				}
				let u = this.parseUrl(n);
				this.scheduleNavigation(u, i, a, s);
			}
			get url() {
				return this.serializeUrl(this.currentUrlTree);
			}
			getCurrentNavigation() {
				return this.navigationTransitions.currentNavigation;
			}
			get lastSuccessfulNavigation() {
				return this.navigationTransitions.lastSuccessfulNavigation;
			}
			resetConfig(n) {
				(this.config = n.map(Xu)), (this.navigated = !1);
			}
			ngOnDestroy() {
				this.dispose();
			}
			dispose() {
				this.navigationTransitions.complete(),
					this.nonRouterCurrentEntryChangeSubscription &&
						(this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
						(this.nonRouterCurrentEntryChangeSubscription =
							void 0)),
					(this.disposed = !0),
					this.eventsSubscription.unsubscribe();
			}
			createUrlTree(n, i = {}) {
				let {
						relativeTo: o,
						queryParams: s,
						fragment: a,
						queryParamsHandling: u,
						preserveFragment: c,
					} = i,
					l = c ? this.currentUrlTree.fragment : a,
					d = null;
				switch (u) {
					case "merge":
						d = m(m({}, this.currentUrlTree.queryParams), s);
						break;
					case "preserve":
						d = this.currentUrlTree.queryParams;
						break;
					default:
						d = s || null;
				}
				d !== null && (d = this.removeEmptyProps(d));
				let f;
				try {
					let h = o ? o.snapshot : this.routerState.snapshot.root;
					f = Wh(h);
				} catch {
					(typeof n[0] != "string" || !n[0].startsWith("/")) &&
						(n = []),
						(f = this.currentUrlTree.root);
				}
				return qh(f, n, d, l ?? null);
			}
			navigateByUrl(n, i = { skipLocationChange: !1 }) {
				let o = Nn(n) ? n : this.parseUrl(n),
					s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
				return this.scheduleNavigation(s, Ir, null, i);
			}
			navigate(n, i = { skipLocationChange: !1 }) {
				return CI(n), this.navigateByUrl(this.createUrlTree(n, i), i);
			}
			serializeUrl(n) {
				return this.urlSerializer.serialize(n);
			}
			parseUrl(n) {
				try {
					return this.urlSerializer.parse(n);
				} catch {
					return this.urlSerializer.parse("/");
				}
			}
			isActive(n, i) {
				let o;
				if (
					(i === !0
						? (o = m({}, yI))
						: i === !1
							? (o = m({}, DI))
							: (o = i),
					Nn(n))
				)
					return Nh(this.currentUrlTree, n, o);
				let s = this.parseUrl(n);
				return Nh(this.currentUrlTree, s, o);
			}
			removeEmptyProps(n) {
				return Object.keys(n).reduce((i, o) => {
					let s = n[o];
					return s != null && (i[o] = s), i;
				}, {});
			}
			scheduleNavigation(n, i, o, s, a) {
				if (this.disposed) return Promise.resolve(!1);
				let u, c, l;
				a
					? ((u = a.resolve), (c = a.reject), (l = a.promise))
					: (l = new Promise((f, h) => {
							(u = f), (c = h);
						}));
				let d = this.pendingTasks.add();
				return (
					mI(this, () => {
						queueMicrotask(() => this.pendingTasks.remove(d));
					}),
					this.navigationTransitions.handleNavigationRequest({
						source: i,
						restoredState: o,
						currentUrlTree: this.currentUrlTree,
						currentRawUrl: this.currentUrlTree,
						rawUrl: n,
						extras: s,
						resolve: u,
						reject: c,
						promise: l,
						currentSnapshot: this.routerState.snapshot,
						currentRouterState: this.routerState,
					}),
					l.catch((f) => Promise.reject(f))
				);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)();
		}),
			(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
		let t = e;
		return t;
	})();
function CI(t) {
	for (let e = 0; e < t.length; e++) if (t[e] == null) throw new C(4008, !1);
}
function wI(t) {
	return !(t instanceof Tr) && !(t instanceof xr);
}
var EI = new w("");
function dp(t, ...e) {
	return ct([
		{ provide: nc, multi: !0, useValue: t },
		[],
		{ provide: On, useFactory: II, deps: [lp] },
		{ provide: En, multi: !0, useFactory: bI },
		e.map((r) => r.ɵproviders),
	]);
}
function II(t) {
	return t.routerState.root;
}
function bI() {
	let t = p(Ke);
	return (e) => {
		let r = t.get(ft);
		if (e !== r.components[0]) return;
		let n = t.get(lp),
			i = t.get(MI);
		t.get(_I) === 1 && n.initialNavigation(),
			t.get(SI, null, x.Optional)?.setUpPreloading(),
			t.get(EI, null, x.Optional)?.init(),
			n.resetRootComponentType(r.componentTypes[0]),
			i.closed || (i.next(), i.complete(), i.unsubscribe());
	};
}
var MI = new w("", { factory: () => new ae() }),
	_I = new w("", { providedIn: "root", factory: () => 1 });
var SI = new w("");
var fp = [];
var hp = { providers: [dp(fp), Ah(), Ch()] };
var wp = (() => {
		let e = class e {
			constructor(n, i) {
				(this._renderer = n),
					(this._elementRef = i),
					(this.onChange = (o) => {}),
					(this.onTouched = () => {});
			}
			setProperty(n, i) {
				this._renderer.setProperty(
					this._elementRef.nativeElement,
					n,
					i,
				);
			}
			registerOnTouched(n) {
				this.onTouched = n;
			}
			registerOnChange(n) {
				this.onChange = n;
			}
			setDisabledState(n) {
				this.setProperty("disabled", n);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(L(fn), L(Ot));
		}),
			(e.ɵdir = Ae({ type: e }));
		let t = e;
		return t;
	})(),
	TI = (() => {
		let e = class e extends wp {};
		(e.ɵfac = (() => {
			let n;
			return function (o) {
				return (n || (n = sr(e)))(o || e);
			};
		})()),
			(e.ɵdir = Ae({ type: e, features: [gn] }));
		let t = e;
		return t;
	})(),
	Ep = new w("NgValueAccessor");
var xI = { provide: Ep, useExisting: tr(() => Bo), multi: !0 };
function AI() {
	let t = Je() ? Je().getUserAgent() : "";
	return /android (\d+)/.test(t.toLowerCase());
}
var NI = new w("CompositionEventMode"),
	Bo = (() => {
		let e = class e extends wp {
			constructor(n, i, o) {
				super(n, i),
					(this._compositionMode = o),
					(this._composing = !1),
					this._compositionMode == null &&
						(this._compositionMode = !AI());
			}
			writeValue(n) {
				let i = n ?? "";
				this.setProperty("value", i);
			}
			_handleInput(n) {
				(!this._compositionMode ||
					(this._compositionMode && !this._composing)) &&
					this.onChange(n);
			}
			_compositionStart() {
				this._composing = !0;
			}
			_compositionEnd(n) {
				(this._composing = !1),
					this._compositionMode && this.onChange(n);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(L(fn), L(Ot), L(NI, 8));
		}),
			(e.ɵdir = Ae({
				type: e,
				selectors: [
					["input", "formControlName", "", 3, "type", "checkbox"],
					["textarea", "formControlName", ""],
					["input", "formControl", "", 3, "type", "checkbox"],
					["textarea", "formControl", ""],
					["input", "ngModel", "", 3, "type", "checkbox"],
					["textarea", "ngModel", ""],
					["", "ngDefaultControl", ""],
				],
				hostBindings: function (i, o) {
					i & 1 &&
						dt("input", function (a) {
							return o._handleInput(a.target.value);
						})("blur", function () {
							return o.onTouched();
						})("compositionstart", function () {
							return o._compositionStart();
						})("compositionend", function (a) {
							return o._compositionEnd(a.target.value);
						});
				},
				features: [Ya([xI]), gn],
			}));
		let t = e;
		return t;
	})();
var OI = new w("NgValidators"),
	RI = new w("NgAsyncValidators");
function Ip(t) {
	return t != null;
}
function bp(t) {
	return Rt(t) ? $(t) : t;
}
function Mp(t) {
	let e = {};
	return (
		t.forEach((r) => {
			e = r != null ? m(m({}, e), r) : e;
		}),
		Object.keys(e).length === 0 ? null : e
	);
}
function _p(t, e) {
	return e.map((r) => r(t));
}
function FI(t) {
	return !t.validate;
}
function Sp(t) {
	return t.map((e) => (FI(e) ? e : (r) => e.validate(r)));
}
function PI(t) {
	if (!t) return null;
	let e = t.filter(Ip);
	return e.length == 0
		? null
		: function (r) {
				return Mp(_p(r, e));
			};
}
function Tp(t) {
	return t != null ? PI(Sp(t)) : null;
}
function kI(t) {
	if (!t) return null;
	let e = t.filter(Ip);
	return e.length == 0
		? null
		: function (r) {
				let n = _p(r, e).map(bp);
				return os(n).pipe(E(Mp));
			};
}
function xp(t) {
	return t != null ? kI(Sp(t)) : null;
}
function pp(t, e) {
	return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function LI(t) {
	return t._rawValidators;
}
function VI(t) {
	return t._rawAsyncValidators;
}
function ic(t) {
	return t ? (Array.isArray(t) ? t : [t]) : [];
}
function $o(t, e) {
	return Array.isArray(t) ? t.includes(e) : t === e;
}
function gp(t, e) {
	let r = ic(e);
	return (
		ic(t).forEach((i) => {
			$o(r, i) || r.push(i);
		}),
		r
	);
}
function mp(t, e) {
	return ic(e).filter((r) => !$o(t, r));
}
var Uo = class {
		constructor() {
			(this._rawValidators = []),
				(this._rawAsyncValidators = []),
				(this._onDestroyCallbacks = []);
		}
		get value() {
			return this.control ? this.control.value : null;
		}
		get valid() {
			return this.control ? this.control.valid : null;
		}
		get invalid() {
			return this.control ? this.control.invalid : null;
		}
		get pending() {
			return this.control ? this.control.pending : null;
		}
		get disabled() {
			return this.control ? this.control.disabled : null;
		}
		get enabled() {
			return this.control ? this.control.enabled : null;
		}
		get errors() {
			return this.control ? this.control.errors : null;
		}
		get pristine() {
			return this.control ? this.control.pristine : null;
		}
		get dirty() {
			return this.control ? this.control.dirty : null;
		}
		get touched() {
			return this.control ? this.control.touched : null;
		}
		get status() {
			return this.control ? this.control.status : null;
		}
		get untouched() {
			return this.control ? this.control.untouched : null;
		}
		get statusChanges() {
			return this.control ? this.control.statusChanges : null;
		}
		get valueChanges() {
			return this.control ? this.control.valueChanges : null;
		}
		get path() {
			return null;
		}
		_setValidators(e) {
			(this._rawValidators = e || []),
				(this._composedValidatorFn = Tp(this._rawValidators));
		}
		_setAsyncValidators(e) {
			(this._rawAsyncValidators = e || []),
				(this._composedAsyncValidatorFn = xp(this._rawAsyncValidators));
		}
		get validator() {
			return this._composedValidatorFn || null;
		}
		get asyncValidator() {
			return this._composedAsyncValidatorFn || null;
		}
		_registerOnDestroy(e) {
			this._onDestroyCallbacks.push(e);
		}
		_invokeOnDestroyCallbacks() {
			this._onDestroyCallbacks.forEach((e) => e()),
				(this._onDestroyCallbacks = []);
		}
		reset(e = void 0) {
			this.control && this.control.reset(e);
		}
		hasError(e, r) {
			return this.control ? this.control.hasError(e, r) : !1;
		}
		getError(e, r) {
			return this.control ? this.control.getError(e, r) : null;
		}
	},
	oc = class extends Uo {
		get formDirective() {
			return null;
		}
		get path() {
			return null;
		}
	},
	Vr = class extends Uo {
		constructor() {
			super(...arguments),
				(this._parent = null),
				(this.name = null),
				(this.valueAccessor = null);
		}
	},
	sc = class {
		constructor(e) {
			this._cd = e;
		}
		get isTouched() {
			return !!this._cd?.control?.touched;
		}
		get isUntouched() {
			return !!this._cd?.control?.untouched;
		}
		get isPristine() {
			return !!this._cd?.control?.pristine;
		}
		get isDirty() {
			return !!this._cd?.control?.dirty;
		}
		get isValid() {
			return !!this._cd?.control?.valid;
		}
		get isInvalid() {
			return !!this._cd?.control?.invalid;
		}
		get isPending() {
			return !!this._cd?.control?.pending;
		}
		get isSubmitted() {
			return !!this._cd?.submitted;
		}
	},
	jI = {
		"[class.ng-untouched]": "isUntouched",
		"[class.ng-touched]": "isTouched",
		"[class.ng-pristine]": "isPristine",
		"[class.ng-dirty]": "isDirty",
		"[class.ng-valid]": "isValid",
		"[class.ng-invalid]": "isInvalid",
		"[class.ng-pending]": "isPending",
	},
	hN = j(m({}, jI), { "[class.ng-submitted]": "isSubmitted" }),
	Ap = (() => {
		let e = class e extends sc {
			constructor(n) {
				super(n);
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(L(Vr, 2));
		}),
			(e.ɵdir = Ae({
				type: e,
				selectors: [
					["", "formControlName", ""],
					["", "ngModel", ""],
					["", "formControl", ""],
				],
				hostVars: 14,
				hostBindings: function (i, o) {
					i & 2 &&
						Wa("ng-untouched", o.isUntouched)(
							"ng-touched",
							o.isTouched,
						)("ng-pristine", o.isPristine)("ng-dirty", o.isDirty)(
							"ng-valid",
							o.isValid,
						)("ng-invalid", o.isInvalid)("ng-pending", o.isPending);
				},
				features: [gn],
			}));
		let t = e;
		return t;
	})();
var kr = "VALID",
	jo = "INVALID",
	Pn = "PENDING",
	Lr = "DISABLED";
function $I(t) {
	return (Ho(t) ? t.validators : t) || null;
}
function UI(t) {
	return Array.isArray(t) ? Tp(t) : t || null;
}
function BI(t, e) {
	return (Ho(e) ? e.asyncValidators : t) || null;
}
function HI(t) {
	return Array.isArray(t) ? xp(t) : t || null;
}
function Ho(t) {
	return t != null && !Array.isArray(t) && typeof t == "object";
}
var ac = class {
	constructor(e, r) {
		(this._pendingDirty = !1),
			(this._hasOwnPendingAsyncValidator = !1),
			(this._pendingTouched = !1),
			(this._onCollectionChange = () => {}),
			(this._parent = null),
			(this.pristine = !0),
			(this.touched = !1),
			(this._onDisabledChange = []),
			this._assignValidators(e),
			this._assignAsyncValidators(r);
	}
	get validator() {
		return this._composedValidatorFn;
	}
	set validator(e) {
		this._rawValidators = this._composedValidatorFn = e;
	}
	get asyncValidator() {
		return this._composedAsyncValidatorFn;
	}
	set asyncValidator(e) {
		this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
	}
	get parent() {
		return this._parent;
	}
	get valid() {
		return this.status === kr;
	}
	get invalid() {
		return this.status === jo;
	}
	get pending() {
		return this.status == Pn;
	}
	get disabled() {
		return this.status === Lr;
	}
	get enabled() {
		return this.status !== Lr;
	}
	get dirty() {
		return !this.pristine;
	}
	get untouched() {
		return !this.touched;
	}
	get updateOn() {
		return this._updateOn
			? this._updateOn
			: this.parent
				? this.parent.updateOn
				: "change";
	}
	setValidators(e) {
		this._assignValidators(e);
	}
	setAsyncValidators(e) {
		this._assignAsyncValidators(e);
	}
	addValidators(e) {
		this.setValidators(gp(e, this._rawValidators));
	}
	addAsyncValidators(e) {
		this.setAsyncValidators(gp(e, this._rawAsyncValidators));
	}
	removeValidators(e) {
		this.setValidators(mp(e, this._rawValidators));
	}
	removeAsyncValidators(e) {
		this.setAsyncValidators(mp(e, this._rawAsyncValidators));
	}
	hasValidator(e) {
		return $o(this._rawValidators, e);
	}
	hasAsyncValidator(e) {
		return $o(this._rawAsyncValidators, e);
	}
	clearValidators() {
		this.validator = null;
	}
	clearAsyncValidators() {
		this.asyncValidator = null;
	}
	markAsTouched(e = {}) {
		(this.touched = !0),
			this._parent && !e.onlySelf && this._parent.markAsTouched(e);
	}
	markAllAsTouched() {
		this.markAsTouched({ onlySelf: !0 }),
			this._forEachChild((e) => e.markAllAsTouched());
	}
	markAsUntouched(e = {}) {
		(this.touched = !1),
			(this._pendingTouched = !1),
			this._forEachChild((r) => {
				r.markAsUntouched({ onlySelf: !0 });
			}),
			this._parent && !e.onlySelf && this._parent._updateTouched(e);
	}
	markAsDirty(e = {}) {
		(this.pristine = !1),
			this._parent && !e.onlySelf && this._parent.markAsDirty(e);
	}
	markAsPristine(e = {}) {
		(this.pristine = !0),
			(this._pendingDirty = !1),
			this._forEachChild((r) => {
				r.markAsPristine({ onlySelf: !0 });
			}),
			this._parent && !e.onlySelf && this._parent._updatePristine(e);
	}
	markAsPending(e = {}) {
		(this.status = Pn),
			e.emitEvent !== !1 && this.statusChanges.emit(this.status),
			this._parent && !e.onlySelf && this._parent.markAsPending(e);
	}
	disable(e = {}) {
		let r = this._parentMarkedDirty(e.onlySelf);
		(this.status = Lr),
			(this.errors = null),
			this._forEachChild((n) => {
				n.disable(j(m({}, e), { onlySelf: !0 }));
			}),
			this._updateValue(),
			e.emitEvent !== !1 &&
				(this.valueChanges.emit(this.value),
				this.statusChanges.emit(this.status)),
			this._updateAncestors(j(m({}, e), { skipPristineCheck: r })),
			this._onDisabledChange.forEach((n) => n(!0));
	}
	enable(e = {}) {
		let r = this._parentMarkedDirty(e.onlySelf);
		(this.status = kr),
			this._forEachChild((n) => {
				n.enable(j(m({}, e), { onlySelf: !0 }));
			}),
			this.updateValueAndValidity({
				onlySelf: !0,
				emitEvent: e.emitEvent,
			}),
			this._updateAncestors(j(m({}, e), { skipPristineCheck: r })),
			this._onDisabledChange.forEach((n) => n(!1));
	}
	_updateAncestors(e) {
		this._parent &&
			!e.onlySelf &&
			(this._parent.updateValueAndValidity(e),
			e.skipPristineCheck || this._parent._updatePristine(),
			this._parent._updateTouched());
	}
	setParent(e) {
		this._parent = e;
	}
	getRawValue() {
		return this.value;
	}
	updateValueAndValidity(e = {}) {
		this._setInitialStatus(),
			this._updateValue(),
			this.enabled &&
				(this._cancelExistingSubscription(),
				(this.errors = this._runValidator()),
				(this.status = this._calculateStatus()),
				(this.status === kr || this.status === Pn) &&
					this._runAsyncValidator(e.emitEvent)),
			e.emitEvent !== !1 &&
				(this.valueChanges.emit(this.value),
				this.statusChanges.emit(this.status)),
			this._parent &&
				!e.onlySelf &&
				this._parent.updateValueAndValidity(e);
	}
	_updateTreeValidity(e = { emitEvent: !0 }) {
		this._forEachChild((r) => r._updateTreeValidity(e)),
			this.updateValueAndValidity({
				onlySelf: !0,
				emitEvent: e.emitEvent,
			});
	}
	_setInitialStatus() {
		this.status = this._allControlsDisabled() ? Lr : kr;
	}
	_runValidator() {
		return this.validator ? this.validator(this) : null;
	}
	_runAsyncValidator(e) {
		if (this.asyncValidator) {
			(this.status = Pn), (this._hasOwnPendingAsyncValidator = !0);
			let r = bp(this.asyncValidator(this));
			this._asyncValidationSubscription = r.subscribe((n) => {
				(this._hasOwnPendingAsyncValidator = !1),
					this.setErrors(n, { emitEvent: e });
			});
		}
	}
	_cancelExistingSubscription() {
		this._asyncValidationSubscription &&
			(this._asyncValidationSubscription.unsubscribe(),
			(this._hasOwnPendingAsyncValidator = !1));
	}
	setErrors(e, r = {}) {
		(this.errors = e), this._updateControlsErrors(r.emitEvent !== !1);
	}
	get(e) {
		let r = e;
		return r == null ||
			(Array.isArray(r) || (r = r.split(".")), r.length === 0)
			? null
			: r.reduce((n, i) => n && n._find(i), this);
	}
	getError(e, r) {
		let n = r ? this.get(r) : this;
		return n && n.errors ? n.errors[e] : null;
	}
	hasError(e, r) {
		return !!this.getError(e, r);
	}
	get root() {
		let e = this;
		for (; e._parent; ) e = e._parent;
		return e;
	}
	_updateControlsErrors(e) {
		(this.status = this._calculateStatus()),
			e && this.statusChanges.emit(this.status),
			this._parent && this._parent._updateControlsErrors(e);
	}
	_initObservables() {
		(this.valueChanges = new X()), (this.statusChanges = new X());
	}
	_calculateStatus() {
		return this._allControlsDisabled()
			? Lr
			: this.errors
				? jo
				: this._hasOwnPendingAsyncValidator ||
					  this._anyControlsHaveStatus(Pn)
					? Pn
					: this._anyControlsHaveStatus(jo)
						? jo
						: kr;
	}
	_anyControlsHaveStatus(e) {
		return this._anyControls((r) => r.status === e);
	}
	_anyControlsDirty() {
		return this._anyControls((e) => e.dirty);
	}
	_anyControlsTouched() {
		return this._anyControls((e) => e.touched);
	}
	_updatePristine(e = {}) {
		(this.pristine = !this._anyControlsDirty()),
			this._parent && !e.onlySelf && this._parent._updatePristine(e);
	}
	_updateTouched(e = {}) {
		(this.touched = this._anyControlsTouched()),
			this._parent && !e.onlySelf && this._parent._updateTouched(e);
	}
	_registerOnCollectionChange(e) {
		this._onCollectionChange = e;
	}
	_setUpdateStrategy(e) {
		Ho(e) && e.updateOn != null && (this._updateOn = e.updateOn);
	}
	_parentMarkedDirty(e) {
		let r = this._parent && this._parent.dirty;
		return !e && !!r && !this._parent._anyControlsDirty();
	}
	_find(e) {
		return null;
	}
	_assignValidators(e) {
		(this._rawValidators = Array.isArray(e) ? e.slice() : e),
			(this._composedValidatorFn = UI(this._rawValidators));
	}
	_assignAsyncValidators(e) {
		(this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
			(this._composedAsyncValidatorFn = HI(this._rawAsyncValidators));
	}
};
var Np = new w("CallSetDisabledState", {
		providedIn: "root",
		factory: () => uc,
	}),
	uc = "always";
function zI(t, e) {
	return [...e.path, t];
}
function GI(t, e, r = uc) {
	qI(t, e),
		e.valueAccessor.writeValue(t.value),
		(t.disabled || r === "always") &&
			e.valueAccessor.setDisabledState?.(t.disabled),
		ZI(t, e),
		QI(t, e),
		YI(t, e),
		WI(t, e);
}
function vp(t, e) {
	t.forEach((r) => {
		r.registerOnValidatorChange && r.registerOnValidatorChange(e);
	});
}
function WI(t, e) {
	if (e.valueAccessor.setDisabledState) {
		let r = (n) => {
			e.valueAccessor.setDisabledState(n);
		};
		t.registerOnDisabledChange(r),
			e._registerOnDestroy(() => {
				t._unregisterOnDisabledChange(r);
			});
	}
}
function qI(t, e) {
	let r = LI(t);
	e.validator !== null
		? t.setValidators(pp(r, e.validator))
		: typeof r == "function" && t.setValidators([r]);
	let n = VI(t);
	e.asyncValidator !== null
		? t.setAsyncValidators(pp(n, e.asyncValidator))
		: typeof n == "function" && t.setAsyncValidators([n]);
	let i = () => t.updateValueAndValidity();
	vp(e._rawValidators, i), vp(e._rawAsyncValidators, i);
}
function ZI(t, e) {
	e.valueAccessor.registerOnChange((r) => {
		(t._pendingValue = r),
			(t._pendingChange = !0),
			(t._pendingDirty = !0),
			t.updateOn === "change" && Op(t, e);
	});
}
function YI(t, e) {
	e.valueAccessor.registerOnTouched(() => {
		(t._pendingTouched = !0),
			t.updateOn === "blur" && t._pendingChange && Op(t, e),
			t.updateOn !== "submit" && t.markAsTouched();
	});
}
function Op(t, e) {
	t._pendingDirty && t.markAsDirty(),
		t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
		e.viewToModelUpdate(t._pendingValue),
		(t._pendingChange = !1);
}
function QI(t, e) {
	let r = (n, i) => {
		e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
	};
	t.registerOnChange(r),
		e._registerOnDestroy(() => {
			t._unregisterOnChange(r);
		});
}
function KI(t, e) {
	if (!t.hasOwnProperty("model")) return !1;
	let r = t.model;
	return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function JI(t) {
	return Object.getPrototypeOf(t.constructor) === TI;
}
function XI(t, e) {
	if (!e) return null;
	Array.isArray(e);
	let r, n, i;
	return (
		e.forEach((o) => {
			o.constructor === Bo ? (r = o) : JI(o) ? (n = o) : (i = o);
		}),
		i || n || r || null
	);
}
function yp(t, e) {
	let r = t.indexOf(e);
	r > -1 && t.splice(r, 1);
}
function Dp(t) {
	return (
		typeof t == "object" &&
		t !== null &&
		Object.keys(t).length === 2 &&
		"value" in t &&
		"disabled" in t
	);
}
var eb = class extends ac {
	constructor(e = null, r, n) {
		super($I(r), BI(n, r)),
			(this.defaultValue = null),
			(this._onChange = []),
			(this._pendingChange = !1),
			this._applyFormState(e),
			this._setUpdateStrategy(r),
			this._initObservables(),
			this.updateValueAndValidity({
				onlySelf: !0,
				emitEvent: !!this.asyncValidator,
			}),
			Ho(r) &&
				(r.nonNullable || r.initialValueIsDefault) &&
				(Dp(e)
					? (this.defaultValue = e.value)
					: (this.defaultValue = e));
	}
	setValue(e, r = {}) {
		(this.value = this._pendingValue = e),
			this._onChange.length &&
				r.emitModelToViewChange !== !1 &&
				this._onChange.forEach((n) =>
					n(this.value, r.emitViewToModelChange !== !1),
				),
			this.updateValueAndValidity(r);
	}
	patchValue(e, r = {}) {
		this.setValue(e, r);
	}
	reset(e = this.defaultValue, r = {}) {
		this._applyFormState(e),
			this.markAsPristine(r),
			this.markAsUntouched(r),
			this.setValue(this.value, r),
			(this._pendingChange = !1);
	}
	_updateValue() {}
	_anyControls(e) {
		return !1;
	}
	_allControlsDisabled() {
		return this.disabled;
	}
	registerOnChange(e) {
		this._onChange.push(e);
	}
	_unregisterOnChange(e) {
		yp(this._onChange, e);
	}
	registerOnDisabledChange(e) {
		this._onDisabledChange.push(e);
	}
	_unregisterOnDisabledChange(e) {
		yp(this._onDisabledChange, e);
	}
	_forEachChild(e) {}
	_syncPendingControls() {
		return this.updateOn === "submit" &&
			(this._pendingDirty && this.markAsDirty(),
			this._pendingTouched && this.markAsTouched(),
			this._pendingChange)
			? (this.setValue(this._pendingValue, {
					onlySelf: !0,
					emitModelToViewChange: !1,
				}),
				!0)
			: !1;
	}
	_applyFormState(e) {
		Dp(e)
			? ((this.value = this._pendingValue = e.value),
				e.disabled
					? this.disable({ onlySelf: !0, emitEvent: !1 })
					: this.enable({ onlySelf: !0, emitEvent: !1 }))
			: (this.value = this._pendingValue = e);
	}
};
var tb = { provide: Vr, useExisting: tr(() => cc) },
	Cp = (() => Promise.resolve())(),
	cc = (() => {
		let e = class e extends Vr {
			constructor(n, i, o, s, a, u) {
				super(),
					(this._changeDetectorRef = a),
					(this.callSetDisabledState = u),
					(this.control = new eb()),
					(this._registered = !1),
					(this.name = ""),
					(this.update = new X()),
					(this._parent = n),
					this._setValidators(i),
					this._setAsyncValidators(o),
					(this.valueAccessor = XI(this, s));
			}
			ngOnChanges(n) {
				if (
					(this._checkForErrors(), !this._registered || "name" in n)
				) {
					if (
						this._registered &&
						(this._checkName(), this.formDirective)
					) {
						let i = n.name.previousValue;
						this.formDirective.removeControl({
							name: i,
							path: this._getPath(i),
						});
					}
					this._setUpControl();
				}
				"isDisabled" in n && this._updateDisabled(n),
					KI(n, this.viewModel) &&
						(this._updateValue(this.model),
						(this.viewModel = this.model));
			}
			ngOnDestroy() {
				this.formDirective && this.formDirective.removeControl(this);
			}
			get path() {
				return this._getPath(this.name);
			}
			get formDirective() {
				return this._parent ? this._parent.formDirective : null;
			}
			viewToModelUpdate(n) {
				(this.viewModel = n), this.update.emit(n);
			}
			_setUpControl() {
				this._setUpdateStrategy(),
					this._isStandalone()
						? this._setUpStandalone()
						: this.formDirective.addControl(this),
					(this._registered = !0);
			}
			_setUpdateStrategy() {
				this.options &&
					this.options.updateOn != null &&
					(this.control._updateOn = this.options.updateOn);
			}
			_isStandalone() {
				return (
					!this._parent || !!(this.options && this.options.standalone)
				);
			}
			_setUpStandalone() {
				GI(this.control, this, this.callSetDisabledState),
					this.control.updateValueAndValidity({ emitEvent: !1 });
			}
			_checkForErrors() {
				this._isStandalone() || this._checkParentType(),
					this._checkName();
			}
			_checkParentType() {}
			_checkName() {
				this.options &&
					this.options.name &&
					(this.name = this.options.name),
					!this._isStandalone() && this.name;
			}
			_updateValue(n) {
				Cp.then(() => {
					this.control.setValue(n, { emitViewToModelChange: !1 }),
						this._changeDetectorRef?.markForCheck();
				});
			}
			_updateDisabled(n) {
				let i = n.isDisabled.currentValue,
					o = i !== 0 && fo(i);
				Cp.then(() => {
					o && !this.control.disabled
						? this.control.disable()
						: !o && this.control.disabled && this.control.enable(),
						this._changeDetectorRef?.markForCheck();
				});
			}
			_getPath(n) {
				return this._parent ? zI(n, this._parent) : [n];
			}
		};
		(e.ɵfac = function (i) {
			return new (i || e)(
				L(oc, 9),
				L(OI, 10),
				L(RI, 10),
				L(Ep, 10),
				L(pn, 8),
				L(Np, 8),
			);
		}),
			(e.ɵdir = Ae({
				type: e,
				selectors: [
					[
						"",
						"ngModel",
						"",
						3,
						"formControlName",
						"",
						3,
						"formControl",
						"",
					],
				],
				inputs: {
					name: "name",
					isDisabled: ["disabled", "isDisabled"],
					model: ["ngModel", "model"],
					options: ["ngModelOptions", "options"],
				},
				outputs: { update: "ngModelChange" },
				exportAs: ["ngModel"],
				features: [Ya([tb]), gn, ln],
			}));
		let t = e;
		return t;
	})();
var nb = (() => {
	let e = class e {};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵmod = Ye({ type: e })),
		(e.ɵinj = Ze({}));
	let t = e;
	return t;
})();
var rb = (() => {
	let e = class e {};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵmod = Ye({ type: e })),
		(e.ɵinj = Ze({ imports: [nb] }));
	let t = e;
	return t;
})();
var Rp = (() => {
	let e = class e {
		static withConfig(n) {
			return {
				ngModule: e,
				providers: [
					{ provide: Np, useValue: n.callSetDisabledState ?? uc },
				],
			};
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵmod = Ye({ type: e })),
		(e.ɵinj = Ze({ imports: [rb] }));
	let t = e;
	return t;
})();
var Fp = (() => {
	let e = class e {
		constructor(n) {
			(this.http = n), (this.baseUrl = "assets/");
		}
		getSpellingWords() {
			return this.http
				.get(this.baseUrl + "spellingWords.txt", {
					responseType: "text",
				})
				.pipe(E((n) => n.split(/\r?\n/)));
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)(D(Pt));
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
	let t = e;
	return t;
})();
var Pp = (() => {
	let e = class e {
		constructor(n) {
			this.spellingWordsService = n;
		}
		getRandomWord() {
			return this.spellingWordsService
				.getSpellingWords()
				.pipe(E((n) => n[Math.floor(Math.random() * n.length)]));
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)(D(Fp));
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
	let t = e;
	return t;
})();
var kp = (() => {
	let e = class e {
		constructor(n) {
			this.http = n;
		}
		getWordDictionary(n) {
			return this.http.get(
				`https://dictionaryapi.com/api/v3/references/collegiate/json/${n}?key=a20edc4b-1173-42ab-8965-54db3f7000da`,
			);
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)(D(Pt));
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
	let t = e;
	return t;
})();
var Lp = (() => {
	let e = class e {
		constructor(n) {
			(this.http = n), (this.baseUrl = "assets/");
		}
		getSpecialChars() {
			return this.http
				.get(this.baseUrl + "specialChars.txt", {
					responseType: "text",
				})
				.pipe(E((n) => n.split(/\r?\n/)));
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)(D(Pt));
	}),
		(e.ɵprov = v({ token: e, factory: e.ɵfac, providedIn: "root" }));
	let t = e;
	return t;
})();
function cb(t, e) {
	if ((t & 1 && (pe(0, "div"), Dn(1), ie()), t & 2)) {
		let r = Za(2);
		lt(1), ao(r.definition);
	}
}
function lb(t, e) {
	if (
		(t & 1 &&
			(pe(0, "div", 10)(1, "div"),
			Dn(2),
			ie(),
			lr(3, cb, 2, 1, "div", 11),
			ie()),
		t & 2)
	) {
		let r = Za();
		lt(2), ao(r.word), lt(1), mn("ngIf", r.needDefinition);
	}
}
function db(t, e) {
	if ((t & 1 && (pe(0, "div", 12), Dn(1), ie()), t & 2)) {
		let r = e.$implicit;
		lt(1), uo(" ", r, " ");
	}
}
var Vp = (() => {
	let e = class e {
		constructor(n, i, o) {
			(this.randomWordService = n),
				(this.wordDictionaryService = i),
				(this.specialCharsService = o),
				(this.word = ""),
				(this.needDefinition = !1),
				(this.definition = ""),
				(this.sound = ""),
				(this.isRevealed = !1),
				(this.specialChars = []),
				(this.userAttempt = "");
		}
		ngOnInit() {
			this.getNewWord(),
				this.specialCharsService.getSpecialChars().subscribe((n) => {
					this.specialChars = n;
				});
		}
		sayWord(n) {
			if (n) new Audio(n).play();
			else {
				let i = new SpeechSynthesisUtterance(this.word);
				speechSynthesis.speak(i);
			}
		}
		getNewWord() {
			(this.definition = ""),
				(this.sound = ""),
				(this.needDefinition = !1),
				(this.isRevealed = !1),
				this.randomWordService.getRandomWord().subscribe((n) => {
					let i = this.modifyWord(n);
					this.getWordDictionary(i);
				});
		}
		modifyWord(n) {
			let i = n;
			return (
				i.includes("(") && (i = i.split("(")[0]),
				i.includes(" \u2022") &&
					((i = i.slice(0, -2)), (this.needDefinition = !0)),
				(this.word = i),
				i.includes(",") && (i = i.split(",")[0]),
				i.includes(" ") && (i = i.replace(" ", "%20")),
				console.log(this.word, "|", i),
				i
			);
		}
		getWordDictionary(n) {
			this.wordDictionaryService.getWordDictionary(n).subscribe((i) => {
				if (i && i.length > 0) {
					console.log(i);
					let o = i[0];
					if (o && typeof o == "object") {
						if (n !== o.hwi.hw.replaceAll("*", "")) {
							this.sayWord();
							return;
						}
						this.definition =
							o.shortdef && o.shortdef.length > 0
								? o.shortdef[0]
								: "No definition available";
						let s = o.hwi;
						s &&
						typeof s == "object" &&
						"prs" in s &&
						s.prs !== void 0
							? ((this.sound = s.prs[0].sound.audio),
								this.getDictionarySoundURL())
							: (this.sayWord(),
								console.warn(
									"Invalid or incomplete hwi structure:",
									s,
								));
					} else {
						this.sayWord(),
							console.warn(
								"Invalid or non-object wordDictionary:",
								o,
							);
						return;
					}
				} else {
					console.warn("Empty or unexpected response:", i);
					return;
				}
			});
		}
		getDictionarySoundURL() {
			let n = "https://media.merriam-webster.com/audio/prons/en/us/wav/";
			this.sound.slice(0, 3) === "bix"
				? (n = n.concat("bix/"))
				: this.sound.slice(0, 2) === "gg"
					? (n = n.concat("gg/"))
					: (n = n.concat(this.sound.charAt(0) + "/")),
				(n = n.concat(this.sound + ".wav")),
				this.sayWord(n);
		}
		checkWord() {
			(this.userAttempt = this.userAttempt.replace("'", "\u2019")),
				this.userAttempt === this.word
					? (this.getNewWord(),
						(this.userAttempt = ""),
						(this.isRevealed = !1))
					: (console.log("incorrect"),
						(this.userAttempt = ""),
						(this.isRevealed = !0));
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)(L(Pp), L(kp), L(Lp));
	}),
		(e.ɵcmp = un({
			type: e,
			selectors: [["word-card"]],
			standalone: !0,
			features: [Cn],
			decls: 14,
			vars: 3,
			consts: [
				[
					1,
					"container-fluid",
					"d-flex",
					"justify-content-center",
					"align-items-center",
					"fill",
				],
				[1, "card", "word-card", "align-items-center"],
				[1, "container", "h-100"],
				[
					1,
					"h-50",
					"justify-content-center",
					"align-items-center",
					"d-flex",
				],
				["class", "text-center", 4, "ngIf"],
				[
					1,
					"form-control",
					"form-control-lg",
					3,
					"ngModel",
					"ngModelChange",
					"keyup.enter",
				],
				[1, "d-flex", "justify-content-center"],
				[1, "btn", "btn-primary", 3, "click"],
				[1, "d-flex", "justify-content-evenly"],
				["class", "d-flex", 4, "ngFor", "ngForOf"],
				[1, "text-center"],
				[4, "ngIf"],
				[1, "d-flex"],
			],
			template: function (i, o) {
				i & 1 &&
					(pe(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3),
					lr(4, lb, 4, 2, "div", 4),
					ie(),
					pe(5, "div")(6, "input", 5),
					dt("ngModelChange", function (a) {
						return (o.userAttempt = a);
					})("keyup.enter", function () {
						return o.checkWord();
					}),
					ie(),
					pe(7, "div", 6)(8, "div", 7),
					dt("click", function () {
						return o.getNewWord();
					}),
					Dn(9, "New Word"),
					ie(),
					pe(10, "div", 7),
					dt("click", function () {
						return o.sayWord();
					}),
					Dn(11, "Speak"),
					ie()()(),
					pe(12, "div", 8),
					lr(13, db, 2, 1, "div", 9),
					ie()()()()),
					i & 2 &&
						(lt(4),
						mn("ngIf", o.isRevealed),
						lt(2),
						mn("ngModel", o.userAttempt),
						lt(7),
						mn("ngForOf", o.specialChars));
			},
			dependencies: [fr, th, nh, Rp, Bo, Ap, cc],
			styles: [
				".word-card[_ngcontent-%COMP%]{width:50%;height:60%}.fill[_ngcontent-%COMP%]{min-height:100%;height:100vh}",
			],
		}));
	let t = e;
	return t;
})();
var jp = (() => {
	let e = class e {
		constructor() {
			this.title = "UIL-Spelling";
		}
	};
	(e.ɵfac = function (i) {
		return new (i || e)();
	}),
		(e.ɵcmp = un({
			type: e,
			selectors: [["app-root"]],
			standalone: !0,
			features: [Cn],
			decls: 3,
			vars: 0,
			template: function (i, o) {
				i & 1 &&
					(pe(0, "div"),
					yn(1, "word-card"),
					ie(),
					yn(2, "router-outlet"));
			},
			dependencies: [fr, Ku, Vp],
		}));
	let t = e;
	return t;
})();
xh(jp, hp).catch((t) => console.error(t));
