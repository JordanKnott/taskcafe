# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Task sorting & filtering
- Redesigned the Task Details UI
- Implement task group actions (duplicate/delete all tasks/sort)

### Fixed
- removed CORS middleware to fix security issue
- Added 3 retries with backoff to initial database connection [(#47)](https://github.com/JordanKnott/taskcafe/issues/47)
- Can now actually set a due date

## [0.1.1] - 2020-08-21

### Fixed
- fix panic(nil) when loading config if config file actually exists

## [0.1.0] - 2020-08-21

### Added
- first "stable" alpha release
