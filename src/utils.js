/* =============================================================================================================
	SyncthingManager 0.47
================================================================================================================

	GJS utils.

	Copyright (c) 2019-2025, 2nv2u <info@2nv2u.com>
	This work is distributed under GPLv3, see LICENSE for more information.
============================================================================================================= */

import GLib from "gi://GLib";
const Signals = imports.signals;

export class Timer {
  constructor(
    timeout,
    recurring = false,
    priority = GLib.PRIORITY_DEFAULT_IDLE
  ) {
    this._timeout = timeout;
    this._recurring = recurring;
    this._priority = priority;
  }

  run(
    callback,
    timeout = this._timeout,
    recurring = this._recurring,
    priority = this._priority
  ) {
    this.cancel();
    this._run(callback, timeout, recurring, priority);
  }

  _run(callback, timeout, recurring, priority) {
    if (!this._source || recurring) {
      this._source = GLib.timeout_source_new(timeout);
      this._source.set_priority(priority);
      this._source.set_callback(() => {
        callback();
        if (recurring) {
          this._run(callback, timeout, recurring, priority);
        } else {
          return GLib.SOURCE_REMOVE;
        }
      });
    }
    this._source.attach(null);
  }

  cancel() {
    if (this._source) {
      this._source.destroy();
      this._source = null;
    }
  }

  static run(
    timeout,
    callback,
    recurring = false,
    priority = GLib.PRIORITY_DEFAULT
  ) {
    return new Timer(timeout, recurring, priority).run(callback);
  }
}

export class Emitter {}
Signals.addSignalMethods(Emitter.prototype);

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TODO: Move to async/await for HTTP connections
// return new Promise((resolve, reject) => {
//   session.queue_message(message, () => {
//     try {
//       if (message.status_code === Soup.KnownStatusCode.OK) {
//         let result = JSON.parse(message.response_body.data);

//         resolve(result);
//       } else {
//         reject(new Error(message.status_code.toString()));
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// });
