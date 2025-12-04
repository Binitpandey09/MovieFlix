console.log('1. Loading axios...');
try { require('axios'); console.log('✅ axios loaded'); } catch (e) { console.error('❌ axios failed:', e.message); }

console.log('2. Loading https...');
try { require('https'); console.log('✅ https loaded'); } catch (e) { console.error('❌ https failed:', e.message); }

console.log('3. Loading mongoose...');
try { require('mongoose'); console.log('✅ mongoose loaded'); } catch (e) { console.error('❌ mongoose failed:', e.message); }

console.log('4. Loading Movie model...');
try { require('../models/Movie'); console.log('✅ Movie model loaded'); } catch (e) { console.error('❌ Movie model failed:', e.message); }

console.log('5. Loading tmdbService...');
try { require('../services/tmdbService'); console.log('✅ tmdbService loaded'); } catch (e) { console.error('❌ tmdbService failed:', e.message); }
