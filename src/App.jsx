
import React, { useEffect, useState } from "react";
import "./styles.css";
import { format } from "date-fns";
import { auth, db, messaging } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { saveAs } from "file-saver";

const SEED_DUAS = [
  { id: "d1", title: "Dua for Ease", arabic: "اللَّهُمَّ يَسِّرْ", translation: "O Allah, make it easy", note: "Short dua for ease and relief." },
  { id: "d2", title: "Sabr & Patience", arabic: "رَبِّ أَوْزِعْنِي", translation: "My Lord, grant me steadfastness", note: "For patience during difficult days." },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      <Header user={user} onNav={setView} onSignOut={() => signOut(auth)} />
      <main style={{flex:1, padding:20}}>
        {loadingAuth ? <div>Loading...</div> : (!user ? <AuthView onSignedIn={()=>setView('home')} /> : (
          <div style={{maxWidth:900, margin:'0 auto'}}>
            {view==='home' && <Home user={user} onNav={setView} />}
            {view==='tracker' && <Tracker user={user} />}
            {view==='add' && <AddEntry user={user} onSaved={()=>setView('tracker')} />}
            {view==='journal' && <div>Journal (to be expanded)</div>}
            {view==='duas' && <Duas />}
            {view==='settings' && <Settings user={user} />}
          </div>
        ))}
      </main>
      <footer style={{padding:12, textAlign:'center', color:'#8C7B92'}}>Track with faith. Care with Salam • Noor Cycle</footer>
    </div>
  );
}

function Header({ user, onNav, onSignOut }){
  return (
    <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:16, background:'#fff'}}>
      <div style={{display:'flex', gap:16, alignItems:'center'}}>
        <div style={{fontWeight:800, color:'#6A0572'}}>Noor Cycle</div>
        <nav style={{display:'flex', gap:8}}>
          <button onClick={()=>onNav('home')} style={{background:'transparent', border:'none', color:'#6A0572'}}>Home</button>
          <button onClick={()=>onNav('tracker')} style={{background:'transparent', border:'none', color:'#6A0572'}}>Tracker</button>
          <button onClick={()=>onNav('journal')} style={{background:'transparent', border:'none', color:'#6A0572'}}>Journal</button>
          <button onClick={()=>onNav('duas')} style={{background:'transparent', border:'none', color:'#6A0572'}}>Duas</button>
        </nav>
      </div>
      <div>
        {user ? (<div style={{display:'flex', gap:10, alignItems:'center'}}><div style={{fontSize:13}}>{user.email}</div><button onClick={onSignOut} style={{border:'1px solid #7F4CC1', background:'transparent', padding:'6px 10px'}}>Sign out</button></div>) : null}
      </div>
    </header>
  );
}

function AuthView({ onSignedIn }){
  const [mode, setMode] = useState('signin'); const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [err,setErr]=useState(null);
  async function signup(){ setErr(null); try{ await createUserWithEmailAndPassword(auth,email,pass); onSignedIn(); } catch(e){ setErr(e.message); } }
  async function signin(){ setErr(null); try{ await signInWithEmailAndPassword(auth,email,pass); onSignedIn(); } catch(e){ setErr(e.message); } }
  return (
    <div style={{maxWidth:420, margin:'40px auto'}}>
      <div style={{background:'#fff', padding:18, borderRadius:12}}>
        <h2 style={{marginTop:0}}>{mode==='signin' ? 'Sign in' : 'Create account'}</h2>
        <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:10, marginBottom:8}}/>
        <input placeholder='Password' type='password' value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%', padding:10, marginBottom:8}}/>
        {err && <div style={{color:'crimson'}}>{err}</div>}
        <div style={{display:'flex', gap:8}}>
          {mode==='signin' ? <button onClick={signin} style={{background:'#7F4CC1', color:'#fff', padding:'8px 12px'}}>Sign in</button> : <button onClick={signup} style={{background:'#7F4CC1', color:'#fff', padding:'8px 12px'}}>Create</button>}
          <button onClick={()=>setMode(mode==='signin'?'signup':'signin')} style={{background:'transparent'}}>Switch</button>
        </div>
        <div style={{marginTop:12, fontSize:13, color:'#6b617a'}}>Noor Cycle keeps your data private.</div>
      </div>
    </div>
  );
}

function Home({ user, onNav }){
  return (
    <div style={{background:'#fff', padding:18, borderRadius:12}}>
      <h3 style={{marginTop:0}}>Welcome to Noor Cycle</h3>
      <div style={{display:'flex', gap:12}}>
        <div style={{flex:1}}>
          <div style={{fontSize:12, color:'#8C7B92'}}>Last period start</div>
          <div style={{fontWeight:700, color:'#6A0572'}}>No data yet</div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:12, color:'#8C7B92'}}>Average cycle</div>
          <div style={{fontWeight:700, color:'#6A0572'}}>—</div>
        </div>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={()=>onNav('add')} style={{background:'#7F4CC1', color:'#fff', padding:'8px 12px', borderRadius:8}}>Add period</button>
        <button onClick={()=>onNav('tracker')} style={{background:'transparent', marginLeft:8, border:'1px solid #EAE3FB', padding:'8px 12px', borderRadius:8}}>Open tracker</button>
      </div>
    </div>
  );
}

function Tracker({ user }){
  const [entries, setEntries] = useState([]);
  useEffect(()=>{ const q = query(collection(db,'users',user.uid,'period_entries'), orderBy('start','asc')); const unsub = onSnapshot(q,(snap)=> setEntries(snap.docs.map(d=>({id:d.id,...d.data()})))); return ()=>unsub(); },[user.uid]);
  return (
    <div style={{background:'#fff', padding:18, borderRadius:12}}>
      <h3 style={{marginTop:0}}>Tracker</h3>
      <div>Calendar visualization coming — entries: {entries.length}</div>
    </div>
  );
}

function AddEntry({ user, onSaved }){
  const [start, setStart] = useState(()=>format(new Date(),'yyyy-MM-dd')); const [duration,setDuration]=useState(5); const [flow,setFlow]=useState('medium'); const [mood,setMood]=useState('tired'); const [notes,setNotes]=useState('');
  const save = async ()=>{ try{ await addDoc(collection(db,'users',user.uid,'period_entries'), { start: new Date(start).toISOString(), duration, flow, mood, notes, createdAt: new Date().toISOString() }); alert('Saved'); if(onSaved) onSaved(); }catch(e){ alert('Error: '+e.message); } };
  return (
    <div style={{background:'#fff', padding:18, borderRadius:12}}>
      <h3 style={{marginTop:0}}>Add Period Entry</h3>
      <label>Start date</label><input type="date" value={start} onChange={e=>setStart(e.target.value)} style={{display:'block', padding:8, marginTop:6, marginBottom:8}}/>
      <label>Duration (days)</label><input type="number" min={1} max={15} value={duration} onChange={e=>setDuration(parseInt(e.target.value)||1)} style={{display:'block', padding:8, marginTop:6, marginBottom:8}}/>
      <label>Flow</label><select value={flow} onChange={e=>setFlow(e.target.value)} style={{display:'block', padding:8, marginTop:6, marginBottom:8}}><option>light</option><option>medium</option><option>heavy</option></select>
      <label>Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{width:'100%', height:80, padding:8}} />
      <div style={{marginTop:10}}><button onClick={save} style={{background:'#7F4CC1', color:'#fff', padding:'8px 12px', borderRadius:8}}>Save</button></div>
    </div>
  );
}

function Duas(){ return (<div style={{background:'#fff', padding:18, borderRadius:12}}><h3 style={{marginTop:0}}>Duas</h3>{SEED_DUAS.map(d=>(<div key={d.id} style={{padding:10, borderRadius:8, background:'#F8F6FB', marginBottom:8}}><div style={{fontWeight:700}}>{d.title}</div><div style={{fontStyle:'italic', marginTop:6}}>{d.arabic}</div><div style={{marginTop:6}}>{d.translation}</div></div>))}</div>); }

function Settings({ user }){
  async function exportCSV(){ try{ const peSnap = await getDocs(query(collection(db,'users',user.uid,'period_entries'), orderBy('createdAt','desc'))); const periods = peSnap.docs.map(d=>({id:d.id, ...d.data()})); const rows = ['id,start,duration,flow,mood,notes']; periods.forEach(p=> rows.push([p.id,p.start,p.duration,p.flow,p.mood, (p.notes||'')].join(','))); const blob = new Blob([rows.join('\\n')], {type:'text/csv'}); saveAs(blob,'noor_export.csv'); }catch(e){ alert('Export error: '+e.message); } }
  return (<div style={{background:'#fff', padding:18, borderRadius:12}}><h3 style={{marginTop:0}}>Settings</h3><div style={{display:'flex', gap:8}}><button onClick={exportCSV} style={{background:'#7F4CC1', color:'#fff', padding:'8px 12px', borderRadius:8}}>Export CSV</button></div></div>);
}
