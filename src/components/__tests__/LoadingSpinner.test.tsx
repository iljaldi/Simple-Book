import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, LoadingPage, LoadingCard } from '../ui/loading';

describe('LoadingSpinner', () => {
  it('기본 크기로 렌더링된다', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('작은 크기로 렌더링된다', () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('큰 크기로 렌더링된다', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('커스텀 클래스가 적용된다', () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('custom-class');
  });
});

describe('LoadingPage', () => {
  it('기본 메시지로 렌더링된다', () => {
    render(<LoadingPage />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('커스텀 메시지로 렌더링된다', () => {
    render(<LoadingPage message="데이터 로딩 중..." />);
    expect(screen.getByText('데이터 로딩 중...')).toBeInTheDocument();
  });

  it('설명이 포함되어 렌더링된다', () => {
    render(<LoadingPage description="잠시만 기다려주세요" />);
    expect(screen.getByText('잠시만 기다려주세요')).toBeInTheDocument();
  });
});

describe('LoadingCard', () => {
  it('기본 메시지로 렌더링된다', () => {
    render(<LoadingCard />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('커스텀 메시지로 렌더링된다', () => {
    render(<LoadingCard message="차트 로딩 중..." />);
    expect(screen.getByText('차트 로딩 중...')).toBeInTheDocument();
  });

  it('커스텀 클래스가 적용된다', () => {
    render(<LoadingCard className="custom-card" />);
    const card = screen.getByText('로딩 중...').closest('div');
    expect(card).toHaveClass('custom-card');
  });
});
