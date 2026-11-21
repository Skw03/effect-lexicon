import { Component, type ReactNode } from 'react';
export class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="status">演示暂时无法运行，请刷新页面重试。您仍可阅读说明和复制提示词。</p> : this.props.children; }
}
