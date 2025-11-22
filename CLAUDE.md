# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

gtop is a terminal-based system monitoring dashboard that displays real-time CPU, memory, network, disk, and process information in an interactive UI. It's similar to the 'top' command but with visual charts and graphs.

## Essential Commands

### Development
- `npm start` or `./bin/gtop` - Launch the gtop dashboard
- `npm run lint` - Format code with Prettier (uses double quotes, semicolons, 100 char width)
- `npm run lint-check` - Check code formatting without making changes
- `npm test` - Currently just a placeholder, no real tests implemented

### Running gtop
- `./bin/gtop` - Run directly from source
- After global install: `gtop`

## Architecture

### Core Pattern
The application follows a modular monitor pattern where each system metric has its own monitor class that:
1. Initializes with UI widget references
2. Makes initial system calls via the `systeminformation` library
3. Sets up periodic intervals for updates (1-3 seconds)
4. Updates data structures and refreshes the UI

### Key Components

**Main Application** (`lib/gtop.js`):
- Uses `blessed` for terminal UI and `blessed-contrib` for charts/widgets
- Creates a 12x12 grid layout
- Initializes all monitor modules with their respective UI widgets
- Handles keyboard shortcuts (p/c/m for sorting, q/Esc for exit)

**Monitor Modules** (`lib/monitor/`):
- `cpu.js` - CPU usage monitoring (1-second updates)
- `mem.js` - Memory and swap monitoring (1-second updates)
- `net.js` - Network activity monitoring
- `disk.js` - Disk usage monitoring
- `proc.js` - Process list monitoring (3-second updates)

**Data Flow**:
- Each monitor uses `systeminformation` library to fetch system data
- Monitors maintain their own data structures (arrays for history, objects for current state)
- UI widgets are updated directly by monitors via references passed during initialization

### UI Layout (12x12 grid)
- CPU chart: 4x12 (top)
- Memory chart: 4x8 (middle-left)
- Memory donut: 2x4 (middle-right top)
- Swap donut: 2x4 (middle-right bottom)
- Network sparkline: 2x6 (bottom-left)
- Disk donut: 2x6 (bottom-center)
- Process table: 4x6 (bottom-right)

## Technology Stack
- **blessed** (v0.1.81) - Terminal UI framework
- **blessed-contrib** (v4.11.0) - Charts and visualization widgets
- **systeminformation** (v5.18.15) - Cross-platform system information

## Platform Considerations
- Full support: Linux, macOS
- Partial support: Windows (CPU and process monitoring disabled)
- Requires Node.js >= 8 (though package.json shows >= 4.0.0)

## Code Style
- Prettier formatting with: double quotes, semicolons, 100 character line width
- Consistent monitor class pattern across all system metrics
- Error handling for unsupported system resources