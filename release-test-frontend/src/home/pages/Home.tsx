import { useState, useCallback, useEffect } from "react";

import ReleaseTemplate from "../components/ReleaseTemplate";
import ReleaseList from "../components/ReleaseList";
import ReleaseInsert from "../components/ReleaseInsert";

import '../../App.css';
import axios from "axios";
import type {Release} from '../types/release';

const API_URL = 'http://localhost:8080/api/releases';

function Home() {
    const [releases, setReleases] = useState<Release[]>([]);

    useEffect(() => {
        const getReleases = async () => {
            try {
                const response = await axios.get<Release[]>(API_URL);
                setReleases(response.data);
            } catch (e) {
                console.error("데이터를 불러오는 중 에러 발생", e);
            }
        };
        getReleases();
    }, []);

    // onInsert 함수의 파라미터 text가 문자열(string)임을 명시
    const onInsert = useCallback(async (text: string) => {
        if (!text) {
            return;
        }
        try {
            const response = await axios.post<Release>(API_URL, { text });
            setReleases(releases.concat(response.data));
        } catch (e) {
            console.error("데이터 추가 중 에러 발생", e);
        }
    }, [releases]);

    // onRemove 함수의 파라미터 id가 숫자(number)임을 명시
    const onRemove = useCallback(async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setReleases(releases.filter(release => release.id !== id));
        } catch (e) {
            console.error("데이터 삭제 중 에러 발생", e);
        }
    }, [releases]);

    // onToggle 함수의 파라미터 id가 숫자(number)임을 명시
    const onToggle = useCallback(async (id: number) => {
        try {
            const releaseToggle = releases.find(release => release.id === id);
            if (!releaseToggle) return;

            const response = await axios.patch<Release>(`${API_URL}/${id}`, {
                completed: !releaseToggle.completed,
            });
            setReleases(
                releases.map((release) =>
                    release.id === id ? { ...response.data } : release,
                ),
            );
        } catch (e) {
            console.error("데이터 수정 중 에러 발생", e);
        }
    }, [releases]);

    return (
        <div className="Home">
            <ReleaseTemplate>
                <ReleaseInsert onInsert={onInsert} />
                <ReleaseList releases={releases} onRemove={onRemove} onToggle={onToggle} />
            </ReleaseTemplate>
        </div>
    );
}
export default Home;