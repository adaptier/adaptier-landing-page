# Adaptier Feature Map

> Research output from all sub-repos. Used as content source for the landing page.

---

## What Adaptier Is

**AdapTier** is an industrial building automation platform that bridges field protocols (Modbus TCP, M-bus TCP, OPC-UA, BACnet/IP, HTTP) to message brokers (MQTT, NATS JetStream). It consists of independently deployable services coordinated through NATS.

**Core value prop:** Zero-downtime, dynamically configurable protocol adaptor runtime with a real-time web UI — configure, monitor, and control field devices without restarting services.

---

## Sub-Project Overview

| Component | Role |
|-----------|------|
| `adaptier-configurator-ui` | React web UI — tree-based config editor, live debug panel |
| `adaptier-configurator-api` | REST + WebSocket API — config CRUD, validation, NATS bridge |
| `adaptier-protocol-service` | Protocol runtime — polls devices, publishes to NATS JetStream |
| `adaptier-fullstack-tests` | End-to-end integration tests (Playwright + real process lifecycle) |
| `adaptier-tools/opcua-browser` | CLI + TUI tool for browsing OPC-UA servers |
| `prototypes/iot-adaptors` | First-gen reference suite: Modbus, OPC-UA, BACnet, HTTP + Monitor UI |
| `adaptier-plc/adaptier-plc-editor` | Browser-based IEC 61131-3 IDE (FBD, LD, SFC, ST) with live online debugging |
| `adaptier-plc/adaptier-plc-runtime` | Lightweight edge PLC execution engine — GCD scheduler, hot-reload, NATS I/O |
| `adaptier-agent` | Edge deployment agent — zip-based app lifecycle, rollback, pm2, NATS-controlled |

---

## Supported Protocols

### Production (Main Services)
| Protocol | Mode | Direction |
|----------|------|-----------|
| **Modbus TCP** | Master/Client | Read + Write |
| **M-bus TCP** | Master | Read + Scan |

### Prototype / Reference Suite
| Protocol | Mode | Direction |
|----------|------|-----------|
| **Modbus TCP** | Master | Read + Write |
| **OPC-UA** | Client | Read + Write (subscriptions + polling) |
| **BACnet/IP** | Client | Read + Write (COV subscriptions + polling) |
| **HTTP REST** | Client | Read + Write (polling + push) |

### Architecture Ready For
- OPC-UA (main service plugin slot)
- BACnet (main service plugin slot)
- SparkPlug B

---

## Protocol Capabilities: Modbus TCP

### Read Function Codes
- FC1 — Read Coils
- FC2 — Read Discrete Inputs
- FC3 — Read Holding Registers
- FC4 — Read Input Registers

### Write Function Codes
- FC5 — Write Single Coil
- FC6 — Write Single Register
- FC15 — Write Multiple Coils
- FC16 — Write Multiple Registers

### Data Types
`int16`, `uint16`, `int32`, `uint32`, `float32`, `float64`, `boolean`

### Register Mapping
- Index-based register extraction
- Scale factor + offset (linear transformation)
- Bitmask extraction (flag bits)
- Unit annotation (e.g. `°C`, `kW`, `m³`)

### Script Handler
- User-supplied JavaScript arrow function: `(data: number[], model) => Record<string, unknown>`
- Sandboxed execution in isolated `node:worker_threads` (zero Node.js imports)
- Fresh worker spawned per invocation, killed on timeout
- Configurable timeout (default 500ms)
- Syntax errors caught at config-save time

### Connection Settings
- Host/port (default 502)
- Connection timeout (default 3s)
- Reconnect: enable/disable, max retries (−1 = infinite), initial delay, exponential backoff factor, max delay cap

### Write Features
- Cyclic writes (interval-based)
- Event-triggered writes
- Rate limiting per write: `drop` or `queue` strategy
- Max writes/hour constraint
- Batched write commands (array payloads)

### Addressing
- Up to 247 unit/slave IDs per connection
- Named devices with hierarchical path prefixes (dotted notation)
- Multiple poll groups per device
- Multiple connections per adaptor

---

## Protocol Capabilities: M-bus TCP

### What It Is
Half-duplex serial-over-TCP meter reading protocol common in European district heating, water, gas, and electricity metering.

### Features
- FCB (Frame Count Bit) alternation per exchange
- Frame variant support: Standard, Variant A, Variant B, Gateway-prefixed
- Checksum validation
- Half-duplex serialization (promise queue)
- Unsolicited frame buffering (gateway chatter handling)

### DIF/VIF Decoding
- Record index, quantity name, physical value, unit extraction
- Multiplier exponent tracking
- Storage number + tariff tracking
- Function field: Instantaneous, Maximum, Minimum, Error

### Bus Scanning (Auto-Discovery)
- Scan primary addresses 1–250
- Configurable per-address timeout (default 500ms)
- Returns: manufacturer, medium, version, ID number + all data records
- UI: Scan Bus Dialog with multi-select bulk import

### Meter Settings
- Primary address (1–250)
- Per-meter poll interval (default 60s)
- Request timeout
- "Ping first" option (SND_NKE before read)
- Record index → named field mappings

---

## Protocol Capabilities: OPC-UA (Prototype)

- Session per server
- Dual mode: periodic `ReadService` polls + OPC-UA MonitoredItem subscriptions
- Bad-quality handling (`quality: bad` emitted on non-zero status)
- Automatic session reconnect, subscriptions recreated after reconnect
- Write commands: `session.writeSingleNode`, optimistic update published
- Data type inference: JS number/boolean/string → OPC-UA DataType

### OPC-UA Browser Tool (CLI + TUI)
- **CLI mode**: Browse RootFolder, dump node tree (Node ID, name, class, data type, value, access level)
- **TUI mode** (blessed terminal UI):
  - Navigable node tree (left pane)
  - Live OPC-UA subscriptions with per-variable COV log (timestamped, max 200 entries)
  - Inline write support with JSON input dialog
  - Search/filter with `/` command

---

## Protocol Capabilities: BACnet/IP (Prototype)

- One UDP socket per network segment (connectionless)
- Dual mode: `ReadPropertyMultiple` polls + `SubscribeCOV` change-of-value
- Unconfirmed COV notifications (no ACK overhead)
- Write commands via `WriteProperty` with configurable priority (1–16; 8 = Manual-Operator)
- Object types: AI, AO, AV, BI, BO, BV, MSI, MSO, MSV
- Application tags: NULL, BOOLEAN, UNSIGNED_INTEGER, SIGNED_INTEGER, REAL, DOUBLE, CHARACTER_STRING, ENUMERATED

---

## Protocol Capabilities: HTTP REST (Prototype)

- Periodic GET/POST/PUT polling
- Imperative `onData` callbacks for full response → model control
- Custom headers, timeouts, body templates
- Write commands via user-defined `buildBody(value)` callback
- Zero southbound dependencies (Node.js built-in `fetch`)

---

## Configurator UI (adaptier-configurator-ui)

### Tree Panel (22% width, virtualized)
Hierarchical navigation of:
- Services (auto-discovered via NATS broadcast)
- Protocol Adaptors (Modbus TCP / M-bus TCP)
- Host Connections
- Devices (Modbus) / Meters (M-bus)
- Poll Groups (Modbus)

Context menu (right-click any node): Add / Delete

### Config Panel (78% width)
Context-aware form rendering based on selected tree node:
- **Connection Form** — host, port, timeout, reconnect strategy
- **Device/Meter Form** — name, unit ID / primary address, poll interval
- **Poll Group Form** — function code, start address, count, interval, request timeout
- **Data Handler Tabs** — switch between Map Handler and Script Handler
- **Map Handler** — register-index-to-value table (type, scale, offset, unit, bitmask)
- **Script Handler** — Monaco editor with JS syntax highlighting, sandboxed execution
- **M-bus Record Mappings** — record-index-to-field-name table

### Debug Panel (bottom right, collapsible)
- Real-time live data stream for selected poll group or meter
- Reverse-chronological log (newest first)
- Configurable max entries, clear button
- Auto-subscribes when poll group/meter selected

### Real-Time Push Events (WebSocket)
- Connection online/error status updates
- Config created/updated/deleted notifications
- Live model data readings (path, value, unit, timestamps)
- Poll error alerts
- Poll-start blink animation (yellow LED pulse per poll group)
- Service presence changes
- Server heartbeat ping

### Form Validation
- Zod schemas + react-hook-form
- Real-time error display per field
- Dirty state tracking (Save disabled until changed)
- Custom cross-field rules (no duplicate unit IDs, etc.)

### Service Discovery
- Auto-broadcast on load (NATS request to all running services)
- Manual refresh button
- 5-second discovery timeout with visual feedback
- WebSocket connection indicator (green/gray dot)

### M-bus Scan Bus Dialog
- Enter address range + per-address timeout
- Animated pulse during scan
- Results table: manufacturer, medium, ID, all data records with indices/values/units
- Multi-select checkboxes → bulk import meters into config

---

## Configurator API (adaptier-configurator-api)

### REST Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| GET | `/ready` | Readiness probe |
| GET | `/api/v1/services` | List registered service UIDs |
| GET | `/api/v1/services/discover` | Broadcast service discovery |
| GET | `/api/v1/services/:serviceUid/status` | Detailed service + adaptor status |
| GET | `/api/v1/adaptors/:serviceUid` | List adaptor IDs |
| GET | `/api/v1/adaptors/:serviceUid/:adaptorId/config` | Load adaptor config |
| PUT | `/api/v1/adaptors/:serviceUid/:adaptorId/config` | Create/update config |
| DELETE | `/api/v1/adaptors/:serviceUid/:adaptorId/config` | Remove adaptor |
| POST | `/api/v1/adaptors/:serviceUid/:adaptorId/scan` | Trigger bus scan |
| POST | `/api/v1/command` | Send service command |
| GET | `/api/v1/events` | SSE fallback stream |

### WebSocket Protocol (JSON-RPC 2.0 style)
Client → Server: `subscribe`, `unsubscribe`, `send_command`, `get_config`, `set_config`, `delete_config`, `subscribe_model_data`, `unsubscribe_model_data`, `scan_bus`

Server → Client events: `connection_status`, `config_changed`, `services_changed`, `model_data`, `poll_error`, `poll_pending`, `server_error`, `ping`

---

## Protocol Service (adaptier-protocol-service)

### Data Output Format (NATS JetStream)
```json
{
  "path": "b001.ahu1.supplyTemperature",
  "data": { "value": 22.7, "unit": "°C" },
  "adaptorId": "adaptor-1",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Key Technical Properties
- Zero external dependencies — custom Modbus + M-bus clients using raw `net.Socket`
- MBAP framing with transaction ID matching for concurrent Modbus requests
- KV watch-based hot-reload (zero-downtime config changes)
- Per-adaptor restart while others keep running
- Rate limiter: sliding-window per write definition
- Status hierarchy: adaptor → connection → device → poll group

### Multi-Tenancy
- `SERVICE_UID` env var scopes all NATS subjects and KV keys
- Single API instance serves unlimited service instances simultaneously
- Broadcast commands to all services or target specific UID

---

## NATS Integration

### JetStream Streams
- `ADAPTIER_MODEL_DATA` — all poll readings, configurable retention (default 24h)

### KV Bucket (`adaptier-config`)
```
adaptors.<serviceUid>.<adaptorId>.modbus-tcp-client  → Modbus config JSON
adaptors.<serviceUid>.<adaptorId>.mbus-tcp-client    → M-bus config JSON
adaptors.<serviceUid>.<adaptorId>.meta               → { adaptorType, createdAt, updatedAt }
index.services.<serviceUid>                          → { knownAdaptorIds: string[] }
```

### Subject Layout
| Subject | Direction | Purpose |
|---------|-----------|---------|
| `adaptier.v1.<uid>.configurations` | req/reply | Config status queries |
| `adaptier.v1.<uid>.commands` | req/reply | Write commands, scan, status |
| `adaptier.v1.<uid>.model.data` | JetStream publish | Poll readings |

---

## Resilience & Reliability Features

- NATS reconnect with automatic stream + KV bucket recreation
- KV watch auto-restart on NATS reconnect (UpdatesOnly mode prevents config history replay)
- Modbus + M-bus clients: reconnect FSM with exponential backoff (configurable multiplier, max delay, max retries)
- WebSocket keep-alive: configurable ping interval (default 30s) + pong timeout (default 10s)
- Unhandled rejection guard (service kills itself on uncaught promise — no silent corruption)
- Graceful shutdown coordination (destroy clients → stop pollers → drain NATS)

---

## Security Features

- **Script sandbox**: `node:worker_threads` with zero Node.js imports (intentional boundary)
- Fresh worker per script invocation, killed on timeout
- Syntax error detection at config-save time (before persistence)
- Script eval error reporting with field paths
- Per-script configurable timeout (default 500ms)

---

## Testing Infrastructure (adaptier-fullstack-tests)

- Self-contained: each test suite starts its own NATS (Docker), configurator-api, and protocol-service
- Zero manual prerequisites
- **Playwright E2E** tests driving real Chromium against live stack
- In-process fake Modbus TCP server with:
  - FC1 (read coils), FC3 (read holding registers), FC5 (write coil), FC6 (write register)
  - Forceful TCP disconnection simulation (`destroyClients()`)
- NATS test helpers: wait on JetStream consumers, catch data/status/error events with timeout safety

### Test Scenarios
1. `modbus-tcp-basic` — Poll reads, delta publishing, snapshots
2. `modbus-tcp-connection-status` — Online/offline transitions
3. `modbus-tcp-multi-connection` — Multiple Modbus gateways via single service
4. `modbus-tcp-nats-reconnect` — NATS reconnection resilience during active polling
5. `frontend-e2e` — Service tree population, config editing, live model data display

---

## Prototype Monitor UI (iot-adaptors)

### Backend BFF Features
- Dual-broker bridge (MQTT + NATS → WebSocket/SSE)
- BACnet device discovery + object enumeration + property reading
- OPC-UA node tree traversal + stateless session-per-request
- Config auto-generation from discovered network
- Hot-reload config deployment via MQTT/NATS
- Channel deletion (clears MQTT retain + NATS purge)

### Frontend SPA Features (zero npm runtime deps)
- **Overview Page** — Adaptor card grid + all-channels live value table
- **Registry Tree Page** — Hierarchical tree with right-click context menus
- **Live Logs Page** — Real-time event stream with filter chips
- **Config Editor Page** — CodeMirror editor + deploy button + "Browse Network"
- **Per-Device Table Page** — Channel table with glob-based filtering
- **Config Builder Wizard** — 4-step: connection → discover → assign roles → review/deploy

---

## Deployment

- **NATS**: Docker image (JetStream enabled), port 4222
- **Configurator API**: Docker image, port 8080 (default)
- **Protocol Service**: Docker image, `SERVICE_UID` env required
- **UI**: Vite build → static files served by API or CDN
- **Agent** (`adaptier-agent`): pm2-based app lifecycle manager, auto-detects `NODE_ID` from MAC address

---

## Key Differentiators (Landing Page Angles)

1. **Hot-reload, zero restarts** — Change any config in the UI; the running adaptor reloads in place
2. **Multi-protocol from day one** — Modbus, M-bus, OPC-UA, BACnet, HTTP — one platform
3. **Bidirectional** — Reads AND writes; control actuators, not just monitor sensors
4. **Script transforms** — Custom JS in a sandboxed worker; handle any proprietary register layout
5. **Real-time UI** — Live poll data, connection status LEDs, debug stream — no polling the UI
6. **Enterprise NATS backbone** — JetStream for durable data, KV for config, req/reply for commands
7. **Multi-tenancy** — One API serves N field sites simultaneously via SERVICE_UID namespacing
8. **Zero external deps** — Custom Modbus and M-bus clients in pure Node.js; no bloat, no native bindings
9. **Bus scanning** — Discover all meters on an M-bus segment in seconds
10. **Security-first scripts** — Worker thread sandbox with zero imports, fresh per invocation, timeout-killed
11. **Browser-based IEC 61131-3 IDE** — Full PLC programming without installed software
12. **Live online debugging** — Force variables, toggle tasks, inspect every pin in real time
13. **Edge-first deployment** — 850 KB runtime bundle, <2s boot, runs on Raspberry Pi
14. **One-command rollback** — Instantly revert any edge app to its previous version

---

## AdapTier PLC (adaptier-plc)

### What It Is
A browser-based IEC 61131-3 PLC programming environment paired with a lightweight edge runtime. The editor (React + Monaco) runs in any browser; the runtime deploys to Raspberry Pi or any Linux x86/ARM device and receives programs over NATS.

**Analogy:** Figma meets industrial automation — cloud-connected, collaboratively editable, instantly deployable to edge nodes.

---

### PLC Editor (adaptier-plc-editor)

#### Programming Languages (IEC 61131-3)
| Language | Type | Status |
|----------|------|--------|
| **Function Block Diagram (FBD)** | Visual, graphical signal flow | Production |
| **Ladder Diagram (LD)** | Visual, SVG rung editor | Production |
| **Sequential Function Chart (SFC)** | Visual, state machine canvas | Production |
| **Structured Text (ST)** | Text, full IEC syntax | Production |

All languages compile to a canonical ST/IR form for unified runtime execution. "View ST" button shows compiled output for any language.

#### Data Types (IEC 61131-3)
**Primitives:** `BOOL`, `BYTE`, `WORD`, `DWORD`, `INT`, `UINT`, `DINT`, `UDINT`, `REAL`, `LREAL`, `TIME`, `STRING`

**User-defined types:**
- **STRUCT** — Named fields with mixed types, nested structs supported
- **ENUM** — Symbolic constants
- **ARRAY** — Fixed-size with user-defined bounds
- **SUBRANGE** — Integer ranges with min/max enforcement (clamps on violation)

**TIME literals:** `T#2s`, `T#1m30s`, `T#500ms`, `T#1d2h3m4s500ms`

#### Standard Library Function Blocks (10)
`TON`, `TOF`, `TP` — On/off/pulse timers
`CTU`, `CTD`, `CTUD` — Up/down/bidirectional counters
`SR`, `RS` — Set/Reset latches (R-dominant and S-dominant)
`R_TRIG`, `F_TRIG` — Rising/falling edge triggers

#### Standard Functions (~120)
- Arithmetic: `ADD`, `SUB`, `MUL`, `DIV`, `MOD`
- Logic: `AND`, `OR`, `XOR`, `NOT`
- Comparison: `GT`, `GE`, `EQ`, `NE`, `LE`, `LT`
- Selection: `SEL` (mux), `MAX`, `MIN`, `ABS`, `MOVE`
- Type conversions: 70+ functions covering all IEC §2.5.1.5 combinations

#### Custom Function Blocks
- User-defined FBs authored in FBD or ST
- Nested FB support (FBs can instantiate other FBs)
- Drag-from-palette onto canvas → auto-creates instance variable
- Breadcrumb hierarchy navigation (e.g. `Main › myFB1 › myFB2`)
- Instance counter badge per FB type; FBInstancesDialog lists all instantiation sites

#### FBD Canvas
- **Node types:** FunctionBlockNode, FunctionNode, VariableNode, JunctionNode, NetworkCommentNode
- **Type-validated wires** — Color-coded by type; red stub on incompatibility
- **Live value badges** (online) — Current values on every wire and pin
- **BOOL wire pulsing** — Green (TRUE) / dark (FALSE) animation
- **Snap-to-grid** (20×20px, toggleable, persisted)
- **Floating/dockable library panel** — Search, drag-to-add, collapsible sections; `Alt+P` shortcut
- **Pin address selectors** — Struct/array field targeting for complex types
- **Double-click to drill** — Navigate into custom FB bodies

#### Ladder Diagram Editor
- Contact (—| —, —|/—), Coil (—( )—), FB Call elements
- SVG rung grid; parallel/series network topology
- Keyboard navigation; coil modes: normal, set, reset, pulse

#### Sequential Function Chart Editor
- Steps, Transitions (ST boolean expressions), Actions
- Action qualifiers: N, S, R, P, L, D
- React Flow canvas; initial step marked with double border

#### ST Editor
- Monaco Editor (VS Code engine)
- IEC 61131-3 Language Server in Web Worker: autocomplete, syntax highlighting, error diagnostics, go-to-definition
- REPEAT/UNTIL, array subscript, struct field access

#### Project Management
- **New / Open / Save / Delete** projects
- **Project tree:** Tasks, POUs, Function Blocks, Functions, Global Variables, Local Variables (per POU), Custom Types
- **Version history:** Auto-snapshot on every deploy; manual snapshots; color-coded diff; restore/rollback; max 50 per project
- **Session persistence:** Auto-restore on refresh; draft recovery dialog for unsaved changes
- **Stable UUID per project** — Detects editor/runtime mismatch

#### I/O Mapping (NATS Integration)
```json
{ "name": "pressure", "type": "REAL", "io": { "subscribe": "adaptier.tag.B01_VVS_P01_PRES" } }
```
- **Subscribe (read):** Push-update var from any NATS subject; supports raw JSON, `{value}`, and Adaptier `{data:{value}}` payloads
- **Write (command):** Request/reply to `adaptier.v1.{writeServiceUid}.commands`
- **Write modes:** `on-change` | `on-interval` | `on-change-and-interval`
- **Discover Dialog** — Browse available Adaptier protocol services, grouped by device

#### Exposed Variables (Publish to HMI/SCADA)
```json
{ "name": "rSetpoint", "expose": { "publishMode": "on-change", "allowWrite": true } }
```
- Auto-subject: `adaptier.plc.{nodeId}.model.data` (publish), `adaptier.plc.{nodeId}.write.{varName}` (subscribe)
- External systems can write back via the write subject

#### Online Mode (Go Online)
| Deploy Mode | varStore | FB State | When |
|-------------|----------|----------|------|
| **Online Update** | Selective delta | Preserved (type-changed FBs replaced) | Logic/var changes, no task restructure |
| **Full Redeploy** | Reset to initial | Preserved | Task structure changed |
| **Redeploy + Reset** | Reset to initial | Wiped | Full clean slate |

#### Live Online Debugging
- Real-time variable snapshots every scan cycle (WebSocket)
- FB pin values — inspect internal state of every FB instance
- **Write variable** — Set once; program may overwrite next cycle
- **Force variable** — Pin value; re-applied after every cycle; `⚡` badge in title bar
- **Release force / Release all forces**
- **Enable/disable tasks online** — No redeploy needed
- **Cross-reference analysis** — Find all usages of any variable

#### Server REST API
| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/api/projects` | List / create projects |
| GET/PUT/DELETE | `/api/projects/:id` | Load / save / delete |
| GET/POST/DELETE | `/api/projects/:id/snapshots` | Snapshot management |
| POST | `/api/projects/:id/restore/:snapshotId` | Restore snapshot |
| GET/POST | `/api/runtimes/:id/deploy` | Deploy IR to runtime |
| POST | `/api/runtimes/:id/control` | start/pause/resume/stop/reset |
| GET | `/api/adaptier/services` | Discover protocol services for I/O mapping |
| GET | `/api/audit` | Deployment audit log |

WebSocket: `/api/runtimes/:id/debug` (bidirectional debug), `/api/runtimes/:id/logs` (log stream)

Authentication: Bearer token via `API_KEY` env var (disabled when unset).

#### UI Design
- Dark theme (`#0d0f12`) + electric amber accent (`#f5a623`)
- IBM Plex Mono (values) + DM Sans (UI chrome)
- Resizable panels with localStorage persistence
- Landing page: project grid + per-runtime status cards with cycle diagnostics

---

### PLC Runtime (adaptier-plc-runtime)

#### Execution Engine
- **GCD-based multi-task scheduler** — Master tick = GCD of all task cycle times; each task runs only when its `nextDueAt ≤ now`
  - Example: MainTask (100ms) + FastTask (50ms) → 50ms master tick; MainTask runs every 2 ticks
- **Topological sort** — Ensures acyclic FBD evaluation order per cycle
- **Atomic plan swap** — Hot-reload at cycle boundary; never mid-cycle
- **Default MainTask** auto-synthesized if project has none (100ms)

#### Scan Cycle (simplified)
```
swap pending plan if any
readInputs()            ← NATS subscriptions
execute due tasks       ← FB.execute() + function evaluations
applyForces()           ← re-apply forced variables
writeOutputs()          ← NATS commands / publish
publishDebugSnapshot()  ← if debug session active
sleep(remaining tick)
scanNumber++
```

#### Variable Store
- Single source of truth for all variable values
- Type coercion on `set()` — keeps values consistent with declared type
- SUBRANGE clamping with console warning
- CONSTANT enforcement (silent rejection)
- Force mechanism: `forceVar` / `releaseForce` / `releaseAllForces` / `applyForces()`

#### RETAIN Persistence
- `/var/adaptier/plc/retain.json` — RETAIN variable values survive power loss
- Auto-loaded on boot; saved on graceful shutdown and on hot-reload swap
- `/var/adaptier/plc/program.json` — Last deployed IR; auto-loaded on boot

#### Online Change State Preservation
| Change | FB/var state |
|--------|-------------|
| Logic change inside POU | ✅ All state preserved |
| Variable added/removed | ✅ Existing vars unaffected |
| FB type unchanged | ✅ Instance state preserved |
| FB type changed | ❌ Instance replaced, fresh state |
| Variable type/scope changed | ❌ Reset to initial value |
| Task structure changed | ❌ Cold restart required |

#### Cycle Diagnostics
- `overrunCount` — Cycles that exceeded target time
- `lastCycleMs` — Wall-clock time for most recent cycle
- `scanNumber` — Auto-incrementing; persisted across reboots
- `cycleTimeMs` — Master tick interval

#### NATS Subject Layout (Runtime)
| Subject | Direction | Purpose |
|---------|-----------|---------|
| `adaptier.plc.deploy.{nodeId}` | inbound | Deploy IR payload |
| `adaptier.plc.program.{nodeId}` | req/reply | Fetch running IR |
| `adaptier.plc.debug.{nodeId}.tx` | inbound | Debug commands |
| `adaptier.plc.debug.{nodeId}.rx` | outbound | Debug snapshots |
| `adaptier.plc.status.{nodeId}` | outbound | Heartbeat (every 5s) |
| `adaptier.plc.control.{nodeId}` | inbound | Lifecycle control |
| `adaptier.plc.logs.{nodeId}` | outbound | Structured log stream |

#### Deployment & Performance
- **Bundle size:** ~850 KB compressed (esbuild, self-contained, no npm install on device)
- **Boot time:** <2 seconds to ready
- **Memory:** 50–200 MB resident
- **Execution latency:** Sub-millisecond for typical programs (100+ FBs)
- **Multi-arch Docker images:** `linux/amd64` + `linux/arm64`
- **Targets:** Raspberry Pi 4/5, any Linux edge device

#### Environment Variables
| Var | Default | Purpose |
|-----|---------|---------|
| `NODE_ID` | — (required) | Unique runtime identity; scopes all NATS subjects |
| `NATS_URL` | `nats://localhost:4222` | NATS server address |
| `DATA_DIR` | `/var/adaptier/plc` | Path for program + RETAIN persistence |

---

## AdapTier Agent (adaptier-agent)

### What It Is
A lightweight NATS-controlled edge deployment agent for Node.js applications. Deploys zip packages to edge nodes, manages process lifecycle via pm2, and supports one-command rollback — all without SSH or direct node access.

---

### Core Capabilities

#### Application Lifecycle
- Deploy Node.js apps as zip packages over NATS (single-shot or chunked)
- Versioned deployments with atomic switchover via symlinks (`current` → `versions/<timestamp>`)
- Automatic `npm install --production` on fresh deployments
- Graceful startup/shutdown with SIGTERM → SIGKILL fallback (5s timeout)
- On-boot app restoration (pm2 resurrect on agent restart)

#### Rollback
- Instant rollback to previous version (`current` ↔ `previous` symlink swap)
- Version pruning: keeps current + previous only; older versions auto-deleted
- Persistent state tracking per application (`state.json`)

#### Chunked Transfer
- Large apps split into configurable chunks (B/KB/MB)
- Per-chunk acknowledgment; automatic reassembly
- 5-minute TTL for incomplete transfers (auto-cleanup)
- Transfer ID (UUID) + chunk index + total-chunks headers

#### Instance Aliasing
- Deploy multiple instances of the same app with different configs via `--as <instanceName>`
- Per-instance environment variables; independent lifecycle

---

### CLI Commands

| Command | Purpose |
|---------|---------|
| `deploy <zip>` | Deploy app to node |
| `deploy <zip> --as <name>` | Deploy with alias |
| `deploy <zip> --chunk-size <size>` | Chunked upload |
| `deploy <zip> --node <nodeId>` | Target specific node |
| `rollback <appName>` | Revert to previous version |
| `status [appName]` | Deployment status + health |
| `stop <appName>` | Stop running app |
| `set-env --app <name> --set KEY=VALUE` | Set env var(s) |
| `set-env --app <name> --env-file <path>` | Load env from file |
| `set-env --app <name> --replace` | Replace all env vars |
| `unset-env --app <name> --key KEY` | Remove env var |
| `create-package --source-dir <path>` | Package local dir |
| `create-package --git-repo <url> --branch <name>` | Clone + package git repo |
| `create-package --build` | Auto-build before packaging |

Package creation automatically excludes: `node_modules`, `.git`, `.env*`, lock files, `.cache`, `coverage`, `logs`.

---

### NATS Integration

#### Inbound (request/reply, node-scoped)
- `adaptier.bootstrap.deploy.<nodeId>` — Deploy (single-shot or chunked finalize)
- `adaptier.bootstrap.deploy.chunk.<nodeId>` — Individual chunk upload
- `adaptier.bootstrap.rollback.<nodeId>` — Version rollback
- `adaptier.bootstrap.status.query.<nodeId>` — Health + deployment status
- `adaptier.bootstrap.stop.<nodeId>` — Stop app
- `adaptier.bootstrap.env.set.<nodeId>` — Update environment variables
- `adaptier.bootstrap.env.unset.<nodeId>` — Remove environment variable

#### Outbound (broadcast)
- `adaptier.bootstrap.status.<nodeId>` — Events: `deployed`, `rolled_back`, `env_updated`, `env_key_removed`, `stopped`, `deploy_failed`, `rollback_failed`
- `adaptier.bootstrap.presence` — Heartbeat (default every 30s): `{ event, nodeId, timestamp, startedAt, version }`

#### Discovery
- `adaptier.bootstrap.discover` — Scatter-gather; all agents respond with node list

---

### Edge Node Identity
Auto-detection hierarchy:
1. `NODE_ID` environment variable
2. Docker: `eth0` MAC address from host `/sys/class/net/eth0/address`
3. Docker fallback: first non-loopback interface MAC
4. Direct execution: `os.hostname()`

---

### File Layout on Edge Node
```
apps/
  <appName>/
    versions/
      <timestamp>/        ← extracted + npm installed
      <timestamp>/        ← previous version
    current → versions/<ts>     ← symlink to active
    previous → versions/<ts>    ← symlink for rollback
    state.json                  ← version metadata
    .env                        ← persisted secrets (0o600)
    out.log, err.log            ← pm2 logs
```

---

### Process Management (pm2)
- Fork mode; one process per app
- Max 10 restarts; minimum 3s uptime before counting as stable; 2s restart delay
- `NODE_ENV=production` enforced for all managed apps
- Real-time status: PID, uptime, restart count, running/stopped state
- pm2 log date formatting; stdout + stderr per app

---

### Security
- `.env` files stored at `0o600` outside versioned directories — survive redeploys
- Automatically excluded from zip packages
- No hardcoded secrets needed in app code

---

### Environment Variables
| Var | Default | Purpose |
|-----|---------|---------|
| `NODE_ID` | auto-detected | Unique node identifier |
| `NATS_URL` | `nats://localhost:4222` | NATS broker address |
| `APPS_DIR` | `./apps` | Managed applications root |
| `LOG_LEVEL` | `info` | debug / info / warn / error |
| `HEARTBEAT_INTERVAL` | `30000` ms | Presence heartbeat frequency |
| `PM2_HOME` | `/apps/.pm2` (Docker) | pm2 home directory |

---

### Docker Setup
- Node 20 Alpine base image
- Auto MAC extraction from host network interface for `NODE_ID`
- Volume mounts: `/apps` (persistent app storage), `/host/net` (host network info, read-only)
- `pm2-runtime` for Docker-aware process management with proper signal forwarding
- Compose: NATS + agent pre-configured; NATS port 4222 exposed
