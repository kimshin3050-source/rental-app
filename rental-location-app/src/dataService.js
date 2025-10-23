// Firestore 데이터 서비스
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase.js';
import { COLLECTION_NAMES } from './constants.js';

// 렌탈 로그 저장
export async function saveRentalLog(data) {
  try {
    const rentalData = {
      ...data,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(
      collection(db, COLLECTION_NAMES.RENTAL_LOGS), 
      rentalData
    );

    return { 
      success: true, 
      id: docRef.id 
    };
  } catch (error) {
    console.error('렌탈 로그 저장 실패:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// 날짜별 렌탈 로그 조회
export async function getRentalLogsByDate(workDate) {
  try {
    const q = query(
      collection(db, COLLECTION_NAMES.RENTAL_LOGS),
      where('workDate', '==', workDate),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const logs = [];
    
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return logs;
  } catch (error) {
    console.error('렌탈 로그 조회 실패:', error);
    return [];
  }
}

// 실시간 렌탈 로그 구독
export function subscribeToRentalLogs(workDate, callback) {
  const q = query(
    collection(db, COLLECTION_NAMES.RENTAL_LOGS),
    where('workDate', '==', workDate),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(logs);
  }, (error) => {
    console.error('실시간 구독 오류:', error);
    callback([]);
  });
}

// 협력사별 렌탈 로그 조회
export async function getRentalLogsByCompany(company, startDate, endDate) {
  try {
    let q = query(
      collection(db, COLLECTION_NAMES.RENTAL_LOGS),
      where('company', '==', company)
    );

    if (startDate && endDate) {
      q = query(
        collection(db, COLLECTION_NAMES.RENTAL_LOGS),
        where('company', '==', company),
        where('workDate', '>=', startDate),
        where('workDate', '<=', endDate),
        orderBy('workDate', 'desc'),
        orderBy('timestamp', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const logs = [];
    
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return logs;
  } catch (error) {
    console.error('협력사별 로그 조회 실패:', error);
    return [];
  }
}

// 구역별 렌탈 로그 조회
export async function getRentalLogsByZone(zone, workDate) {
  try {
    const q = query(
      collection(db, COLLECTION_NAMES.RENTAL_LOGS),
      where('zone', '==', zone),
      where('workDate', '==', workDate),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const logs = [];
    
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return logs;
  } catch (error) {
    console.error('구역별 로그 조회 실패:', error);
    return [];
  }
}

// 통계 데이터 조회
export async function getStatsByDate(workDate) {
  try {
    const logs = await getRentalLogsByDate(workDate);
    
    const stats = {
      totalCount: 0,
      totalRental: 0,
      companyCount: new Set(),
      zoneCount: new Set(),
      byCompany: {},
      byZone: {}
    };

    logs.forEach(log => {
      stats.totalCount++;
      stats.totalRental += (log.rentalCount || 0);
      stats.companyCount.add(log.company);
      stats.zoneCount.add(log.zone);

      // 협력사별 통계
      if (!stats.byCompany[log.company]) {
        stats.byCompany[log.company] = {
          count: 0,
          rental: 0
        };
      }
      stats.byCompany[log.company].count++;
      stats.byCompany[log.company].rental += (log.rentalCount || 0);

      // 구역별 통계
      if (!stats.byZone[log.zone]) {
        stats.byZone[log.zone] = {
          count: 0,
          rental: 0,
          companies: new Set()
        };
      }
      stats.byZone[log.zone].count++;
      stats.byZone[log.zone].rental += (log.rentalCount || 0);
      stats.byZone[log.zone].companies.add(log.company);
    });

    // Set을 배열로 변환
    Object.keys(stats.byZone).forEach(zone => {
      stats.byZone[zone].companies = Array.from(stats.byZone[zone].companies);
    });

    return {
      totalCount: stats.totalCount,
      totalRental: stats.totalRental,
      companyCount: stats.companyCount.size,
      zoneCount: stats.zoneCount.size,
      byCompany: stats.byCompany,
      byZone: stats.byZone
    };
  } catch (error) {
    console.error('통계 조회 실패:', error);
    return {
      totalCount: 0,
      totalRental: 0,
      companyCount: 0,
      zoneCount: 0,
      byCompany: {},
      byZone: {}
    };
  }
}

// 최근 렌탈 로그 조회 (대시보드용)
export async function getRecentLogs(limitCount = 10) {
  try {
    const q = query(
      collection(db, COLLECTION_NAMES.RENTAL_LOGS),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const logs = [];
    
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return logs;
  } catch (error) {
    console.error('최근 로그 조회 실패:', error);
    return [];
  }
}

// 렌탈 로그 수정
export async function updateRentalLog(id, data) {
  try {
    const docRef = doc(db, COLLECTION_NAMES.RENTAL_LOGS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('렌탈 로그 수정 실패:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// 렌탈 로그 삭제
export async function deleteRentalLog(id) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAMES.RENTAL_LOGS, id));
    return { success: true };
  } catch (error) {
    console.error('렌탈 로그 삭제 실패:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// 설정 저장
export async function saveSettings(settings) {
  try {
    await setDoc(
      doc(db, COLLECTION_NAMES.SETTINGS, 'config'), 
      settings,
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.error('설정 저장 실패:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// 설정 조회
export async function getSettings() {
  try {
    const docRef = doc(db, COLLECTION_NAMES.SETTINGS, 'config');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('설정 조회 실패:', error);
    return null;
  }
}
