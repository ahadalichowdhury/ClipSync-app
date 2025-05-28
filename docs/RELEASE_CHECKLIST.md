# ✅ Release Checklist

**Follow this checklist before each ClipSync release**

## **🔍 Pre-Release Testing**

### **Code Quality**

- [ ] Run `npm run lint` - No errors
- [ ] Run `npm test` - All tests pass
- [ ] Run `npm run typecheck` - No TypeScript errors
- [ ] Code reviewed and cleaned up

### **Version Update**

- [ ] Update version in `package.json`
- [ ] Update version in `src/main/index.ts` (if applicable)
- [ ] Update CHANGELOG.md with new features/fixes
- [ ] Commit version changes

### **Local Testing**

- [ ] `npm run dev` - App starts correctly
- [ ] Test all major features work
- [ ] Test hotkey functionality
- [ ] Test clipboard operations
- [ ] Test on target platforms

## **🚀 Build Process**

### **Windows Build**

- [ ] `npm run dist:unsigned` - Quick test build
- [ ] Test installer works
- [ ] Test portable version works
- [ ] Optional: Create self-signed certificate
- [ ] `npm run dist:win` - Final signed build

### **macOS Build**

- [ ] `npm run dist:mac` - Build for current arch
- [ ] Test .dmg installer
- [ ] Test app launches correctly
- [ ] Optional: `npm run dist:mac:universal` for both architectures

### **Linux Build**

- [ ] `npm run dist:linux` - All formats
- [ ] Test AppImage: `chmod +x ClipSync-1.0.0.AppImage && ./ClipSync-1.0.0.AppImage`
- [ ] Test .deb package (if on Debian/Ubuntu)
- [ ] Test .rpm package (if on Red Hat/Fedora)

## **📦 Distribution**

### **Direct Distribution**

- [ ] Upload builds to GitHub Releases
- [ ] Write release notes
- [ ] Tag release in git: `git tag v1.0.0`
- [ ] Push tags: `git push --tags`

### **Store Distribution (Optional)**

#### **Windows**

- [ ] Microsoft Store submission (if applicable)
- [ ] Update store listing

#### **macOS**

- [ ] Mac App Store submission (if applicable)
- [ ] Notarization (if applicable)

#### **Linux**

- [ ] Snap Store: `snapcraft upload clipsync_1.0.0_amd64.snap`
- [ ] Flathub submission (if applicable)
- [ ] AUR package update (if applicable)

## **🧪 Post-Release Testing**

### **Installation Testing**

- [ ] Download and install from release page
- [ ] Test fresh installation works
- [ ] Test auto-updater (if implemented)
- [ ] Verify all platforms work correctly

### **User Experience**

- [ ] First-run experience works
- [ ] Settings persist correctly
- [ ] No crashes on startup
- [ ] Performance is acceptable

## **📢 Release Announcement**

### **Documentation**

- [ ] Update README.md if needed
- [ ] Update documentation
- [ ] Update screenshots (if UI changed)

### **Communication**

- [ ] GitHub release announcement
- [ ] Social media posts (if applicable)
- [ ] Update project website (if applicable)
- [ ] Notify users/community

## **🔧 Post-Release Monitoring**

### **First 24 Hours**

- [ ] Monitor for crash reports
- [ ] Check GitHub issues for problems
- [ ] Monitor download statistics
- [ ] Respond to user feedback

### **First Week**

- [ ] Collect user feedback
- [ ] Plan hotfixes if needed
- [ ] Update documentation based on user questions
- [ ] Plan next release features

## **📊 Release Metrics**

Track these metrics for each release:

- [ ] Download count per platform
- [ ] User feedback/ratings
- [ ] Crash reports
- [ ] Performance metrics
- [ ] Feature usage statistics

## **🚨 Emergency Procedures**

### **If Critical Bug Found**

1. [ ] Create hotfix branch
2. [ ] Fix critical issue
3. [ ] Test fix thoroughly
4. [ ] Release patch version (e.g., 1.0.1)
5. [ ] Update all distribution channels

### **If Security Issue Found**

1. [ ] Assess severity
2. [ ] Create security patch
3. [ ] Coordinate disclosure
4. [ ] Release security update
5. [ ] Notify users immediately

---

## **🎯 Quick Release Commands**

```bash
# Pre-release checks
npm run lint && npm test && npm run typecheck

# Build all platforms
npm run dist:unsigned

# Create GitHub release
git tag v1.0.0
git push --tags

# Linux store distribution
npm run setup:snap
snapcraft upload clipsync_1.0.0_amd64.snap
```

---

**💡 Remember:** Quality over speed. Better to delay a release than ship broken software!
