import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function NotFound() {
    return <div className="w-dvw h-dvh flex justify-center items-center bg-primary/50">
        <Card className='w-[50%] max-w-100'>
            <img alt="DB Logo" className='h-40 w-40 mx-auto' src={"/DB_Logo_Round.png"}/>
            <CardHeader>
                <CardTitle>Página não encontrada</CardTitle>
                <CardDescription>
                    Parece que a página que estás a tentar aceder não existe... Se achas que é um erro, por favor reporta a situação.
                </CardDescription>
            </CardHeader>
        </Card> 
    </div>
}
