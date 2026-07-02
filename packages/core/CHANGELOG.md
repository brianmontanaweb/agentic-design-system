# @agentic-ds/core

## 0.2.0

### Minor Changes

- Bundle dependencies into @agentic-ds/core for zero-config install. The internal @agentic-ds/tokens package is now inlined into the dist bundle, and react, react-dom, and @chakra-ui/react have moved from peerDependencies to dependencies. Consumers now only need to run `npm install @agentic-ds/core` — nothing else to install.
