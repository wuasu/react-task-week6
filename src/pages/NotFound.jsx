import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <>
            <h3>此頁面不存在</h3>
            <Link to="/">回到首頁</Link>
        </>
    )
    
}