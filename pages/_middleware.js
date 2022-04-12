import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  // token will exist if the user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  const { pathname } = req.nextUrl

  // ALlow the request if the following is true:
  // 1) it's a request to next-auth session
  // 2) the token exists

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // redirect to login page if the user is not logged in and they are requesting a protected routeing a protected route
  if (!token && pathname !== url.pathname) {
    return NextResponse.rewrite(url)
  }
}

/*
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req){
    console.log(req)
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    console.log("Token:",token)
    const { pathname }  = req.nextUrl;
    console.log("Path",pathname)

    if(pathname.includes("/api/auth") || token){
        console.log("going to next")
        return NextResponse.next()
    }

    if (!token && pathname !== "/login"){
        console.log("going to login")
        //return NextResponse.rewrite(new URL('/login', req.url))
        return NextResponse.redirect("/login")
    }
}
*/